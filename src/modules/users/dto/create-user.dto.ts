// src/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator'

export class CreateUserDto {
    @ApiProperty({ description: 'Nombre del usuario', example: 'Test User' })
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'test@example.com',
    })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string

    @ApiProperty({
        description: 'Contraseña del usuario (mínimo 6 caracteres)',
        example: 'userPassword123',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string

    @ApiProperty({
        description: 'ID del rol asignado al usuario',
        example: '60f7b1b3b3b3b3b3b3b3b3b3',
    })
    @IsOptional()
    readonly role: string
}
