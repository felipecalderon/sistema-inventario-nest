import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiResponse } from '@nestjs/swagger'
import { LocalAuthGuard } from './guards/local.guard'
import { JwtAuthGuard } from './guards/jwt.guard'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiResponse({ status: 201, description: 'Acceso exitoso' })
    @ApiResponse({
        status: 400,
        description: 'Ingreso incorrecto por credenciales inválidas',
    })
    @ApiResponse({
        status: 404,
        description: 'Ingreso incorrecto usuario no existe',
    })
    async login(@Body() body: { email: string; password: string }) {
        return this.authService.login(body)
    }

    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: 'Acceso exitoso',
        example: {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...',
            refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....',
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Token incorrecto o expirado',
    })
    refresh(@Body('refresh_token') refreshToken: string) {
        return this.authService.refreshToken(refreshToken)
    }
}
