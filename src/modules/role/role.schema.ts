import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Permission } from './permission.schema'

export type RoleDocument = Role & Document

@Schema()
export class Role {
    @Prop({ required: true })
    name: string

    @Prop({ type: Types.ObjectId, ref: Permission.name, required: true })
    permissions: Types.ObjectId[] // Referencia a permisos

    @Prop({ required: true, default: false })
    immutable: boolean

    @Prop({ required: true, default: false })
    isSuperAdmin: boolean
}

export const RoleSchema = SchemaFactory.createForClass(Role)
