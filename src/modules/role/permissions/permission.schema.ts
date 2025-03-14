import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type PermissionDocument = Permission & Document

@Schema()
export class Permission {
    _id: Types.ObjectId // Declarado porque es una clase, pero no es necesario

    @Prop({ required: true, unique: true })
    name: string
}

export const PermissionSchema = SchemaFactory.createForClass(Permission)
