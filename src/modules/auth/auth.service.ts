import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { UserDocument } from 'src/modules/users/users.schema'
import { UsersService } from 'src/modules/users/users.service'

interface PayloadDecoded {
    email: string
    sub: string
    iat: number
    exp: number
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(user: { email: string; password: string }) {
        const userData = await this.validateUser(user.email, user.password)
        if (!userData) throw new UnauthorizedException()
        // Generar JWTs
        const payload = { email: userData.email, sub: userData._id }
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
            user: userData,
        }
    }

    async validateUser(
        email: string,
        pass: string,
    ): Promise<UserDocument | null> {
        const user = await this.usersService.findOneByEmail(email)

        if (!user) {
            throw new NotFoundException('Usuario no registrado')
        }

        const isPasswordValid = await compare(pass, user.password)
        if (!isPasswordValid) {
            throw new BadRequestException('Contraseña incorrecta')
        }

        return user
    }

    async refreshToken(refreshToken: string) {
        try {
            const decoded: PayloadDecoded =
                await this.jwtService.verifyAsync(refreshToken) // Validar el token
            const user = await this.usersService.findOne(decoded.sub) // Obtener usuario

            if (!user) {
                throw new UnauthorizedException('Usuario no encontrado')
            }

            const payload = { email: user.email, sub: user._id }

            return {
                access_token: this.jwtService.sign(payload),
                refresh_token: this.jwtService.sign(
                    { payload },
                    { expiresIn: '7d' },
                ),
            }
        } catch (error) {
            throw new UnauthorizedException('Token inválido o expirado')
        }
    }
}
