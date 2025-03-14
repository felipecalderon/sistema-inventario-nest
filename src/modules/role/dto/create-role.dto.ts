// src/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import {
    IsArray,
    IsBoolean,
    IsLowercase,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateRoleDTO {
    @ApiProperty({ description: 'Nombre del rol', example: 'vendedor' })
    @IsNotEmpty()
    @IsString()
    @IsLowercase()
    readonly name: string

    @ApiProperty({
        description: 'Indica si el rol es inmutable (ej: superusuario)',
        example: false,
    })
    @IsBoolean()
    readonly immutable: boolean

    @ApiProperty({
        description: 'Permisos que tiene dicho rol',
        example: ['ver_ventas', 'editar_ventas'],
        type: [String],
    })
    @IsArray()
    @Type(() => String)
    readonly permissions: string[]

    @ApiProperty({
        description: 'Indica si el rol es superadmin',
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    readonly isSuperAdmin: boolean
}
