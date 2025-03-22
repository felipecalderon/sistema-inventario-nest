// src/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
    IsDateString,
    Matches,
} from 'class-validator'

export class CreateUserDto {
    @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
    @IsNotEmpty()
    @IsString()
    readonly lastName: string

    @ApiProperty({ description: 'RUT del usuario', example: '12.345.678-9' })
    @IsNotEmpty()
    @IsString()
    // Ejemplo de regex simple para RUT (puedes ajustarlo según tus necesidades)
    @Matches(/^\d{1,2}\.?\d{3}\.?\d{3}\-?[\dkK]$/, {
        message: 'El RUT no tiene un formato válido',
    })
    readonly rut: string

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'juan.perez@example.com',
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
        example: '55dd55ddd5d5d5ddd', // o un identificador único de rol
    })
    @IsNotEmpty()
    @IsString()
    readonly role: string

    @ApiProperty({
        description: 'Fecha de inicio del contrato (ISO8601)',
        example: '2021-08-01',
    })
    @IsNotEmpty()
    @IsDateString()
    readonly contractStartDate: string

    @ApiProperty({
        description: 'Cargo o puesto del usuario',
        example: 'Operario de Producción',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly position?: string

    @ApiProperty({
        description: 'Número de teléfono',
        example: '+56912345678',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly phone?: string

    @ApiProperty({
        description: 'URL Foto de perfil',
        example: 'https:cloudinary...',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly image?: string

    @ApiProperty({
        description: 'Dirección de hogar',
        example: 'AV. Siempreviva 742',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly address?: string

    @ApiProperty({
        description: 'Ciudad de hogar',
        example: 'Temuco',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly city?: string
}
