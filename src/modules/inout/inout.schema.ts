import { User } from '@/modules/users/users.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type InOutDocument = InOut & Document

@Schema({ timestamps: true })
export class InOut {
    // Relación con el usuario (trabajador)
    @Prop({ required: true, type: Types.ObjectId, ref: User.name })
    user: Types.ObjectId

    // Tipo de registro: IN para entrada, OUT para salida
    @Prop({ required: true, enum: ['IN', 'OUT'] })
    type: string

    // Timestamp que marca la fecha y hora del registro
    @Prop({ required: true })
    timestamp: Date

    // Notas o comentarios sobre el registro (opcional)
    @Prop({ required: false })
    notes?: string
}

export const InOutSchema = SchemaFactory.createForClass(InOut)

// Agregar índice compuesto para optimizar consultas por usuario y fecha
InOutSchema.index({ user: 1, timestamp: 1 })
