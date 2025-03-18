// src/users/users.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { User } from './users.schema'

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiResponse({
        status: 201,
        description: 'Usuario creado exitosamente',
        type: User,
        example: {
            name: 'Test User',
            email: 'test@example.com',
            password: '$2b$10$Hb/E2STZjdiTGHT...',
            _id: '100001110001',
            createdAt: '2025-03-11T16:16:33.518Z',
            updatedAt: '2025-03-11T16:16:33.518Z',
            __v: 0,
        },
    })
    @ApiResponse({ status: 400, description: 'Usuario ya existente' })
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto)
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuarios',
        type: [User],
    })
    async findAll() {
        return this.usersService.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un usuario por ID' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
    @ApiResponse({ status: 400, description: 'ID inválido' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async findOne(@Param('id') id: string) {
        return await this.usersService.findOne(id)
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un usuario por ID' })
    @ApiResponse({
        status: 200,
        description: 'Usuario actualizado',
        type: User,
    })
    @ApiResponse({ status: 400, description: 'ID inválido' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.usersService.update(id, updateUserDto)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un usuario por ID' })
    @ApiResponse({ status: 200, description: 'Usuario eliminado', type: User })
    @ApiResponse({ status: 400, description: 'ID inválido' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async remove(@Param('id') id: string): Promise<User> {
        return this.usersService.remove(id)
    }
}
