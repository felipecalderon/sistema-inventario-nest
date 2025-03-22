import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { genSalt, hash } from 'bcrypt'
import { Document, Types } from 'mongoose'
import { Role } from '@/modules/role/role.schema'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
    _id: Types.ObjectId // Declarado porque es una clase, pero no es necesario

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    lastName: string

    @Prop({ required: true })
    rut: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop({ type: Types.ObjectId, ref: Role.name, required: true })
    role: Types.ObjectId // Referencia a roles

    @Prop({ required: false })
    contractStartDate: string

    @Prop({ required: false })
    position: string

    @Prop({ required: false })
    phone: string

    @Prop({ required: false })
    image: string

    @Prop({ required: false })
    address: string

    @Prop({ required: false })
    city: string
}

export const UserSchema = SchemaFactory.createForClass(User)

// hashear la contraseña antes de guardar
UserSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await genSalt(10)
    this.password = await hash(this.password, salt)
    next()
})
