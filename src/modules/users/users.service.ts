import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, UserDocument } from './users.schema'
import { validateId } from 'src/utils/validate-id'
import { RolesService } from '../role/role.service'
import { isMongoError } from '@/utils/validate-mongo-errors'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly rolesService: RolesService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        try {
            let role = await this.rolesService.getRoleById(createUserDto.role)
            if (!role) {
                const roles = await this.rolesService.getAllRoles()
                if (!roles.length) {
                    role = await this.rolesService.createRole({
                        name: 'superusuario',
                        permissions: [],
                        immutable: true,
                        isSuperAdmin: true,
                    })
                } else {
                    throw new BadRequestException(
                        'Debe especificar un rol válido.',
                    )
                }
            }
            const user = await this.userModel.create({
                ...createUserDto,
                role: role._id,
            })
            const savedUser = await user.save()
            return savedUser.populate('role')
        } catch (error) {
            isMongoError(error, User.name, createUserDto.email)
            throw new InternalServerErrorException(
                'Error interno (distinto de la base de datos)',
            )
        }
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().populate('role').exec()
    }

    async findOneByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).populate('role').exec()
    }

    async findOne(id: string): Promise<UserDocument> {
        validateId(id)
        const user = await this.userModel.findById(id).exec()
        if (!user) throw new NotFoundException('Usuario no encontrado')
        const userWithRole = user.populate('role')
        return userWithRole
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<UserDocument> {
        validateId(id)
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec()
        if (!updatedUser) throw new NotFoundException('Usuario no encontrado')
        return updatedUser
    }

    async remove(id: string): Promise<User> {
        validateId(id)
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec()
        if (!deletedUser) throw new NotFoundException('Usuario no encontrado')
        return deletedUser
    }
}
