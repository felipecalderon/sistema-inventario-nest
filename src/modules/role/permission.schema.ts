import { Schema, model } from 'mongoose'

export type PermissionDocument = typeof Permission & Document

export const PermissionSchema = new Schema({
    name: { type: String, required: true, unique: true },
})

export const Permission = model('Permission', PermissionSchema)
