import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsDateString,
    IsEnum,
} from 'class-validator'

export class CreateInOutDto {
    @ApiProperty({
        description: 'ID del usuario',
        example: '55dd55ddd5d5d5ddd',
    })
    @IsNotEmpty()
    @IsString()
    readonly user: string

    @ApiProperty({
        description: 'Tipo de registro (IN para entrada, OUT para salida)',
        example: 'IN',
    })
    @IsNotEmpty()
    @IsEnum(['IN', 'OUT'])
    readonly type: string

    @ApiProperty({
        description: 'Fecha y hora del registro (ISO8601)',
        example: '2021-08-01T08:00:00.000Z',
    })
    @IsNotEmpty()
    @IsDateString()
    readonly timestamp: Date

    @ApiProperty({
        description: 'Notas o comentarios sobre el registro',
        example: 'Comentario opcional',
    })
    @IsOptional()
    @IsString()
    readonly notes?: string
}
