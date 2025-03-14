import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Permission } from './permissions/permission.schema'

export type RoleDocument = Role & Document

@Schema()
export class Role {
    _id: Types.ObjectId // Declarado porque es una clase, pero no es necesario

    @Prop({ required: true, unique: true })
    name: string

    @Prop({ type: [Types.ObjectId], ref: Permission.name, required: true })
    permissions: Types.ObjectId[] // Referencia a permisos

    @Prop({ required: true, default: false })
    immutable: boolean

    @Prop({ required: true, default: false })
    isSuperAdmin: boolean
}

export const RoleSchema = SchemaFactory.createForClass(Role)
