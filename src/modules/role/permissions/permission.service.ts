import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Permission, PermissionDocument } from './permission.schema'
import { Model } from 'mongoose'
import { isMongoError } from '@/utils/validate-mongo-errors'

@Injectable()
export class PermissionsService {
    constructor(
        @InjectModel(Permission.name)
        private permissionModel: Model<PermissionDocument>,
    ) {}

    async findPermissionsByIds(
        ids?: string | string[],
    ): Promise<PermissionDocument[]> {
        try {
            if (!ids) {
                return this.permissionModel.find().exec()
            }
            if (Array.isArray(ids)) {
                return this.permissionModel.find({ _id: { $in: ids } }).exec()
            }
            return this.permissionModel.find({ _id: ids }).exec()
        } catch (error) {
            isMongoError(error, Permission.name, ids?.toLocaleString() || '')
            throw new InternalServerErrorException(
                'Error interno (distinto de la base de datos)',
            )
        }
    }

    async createPermission(name: string): Promise<PermissionDocument> {
        try {
            const newPermission = new this.permissionModel({ name })
            return await newPermission.save()
        } catch (error) {
            isMongoError(error, Permission.name, name)
            throw new InternalServerErrorException(
                'Error interno (distinto de la base de datos)',
            )
        }
    }

    async createBulkPermissions(
        names: string[],
    ): Promise<PermissionDocument[]> {
        try {
            const nombres = names.map((name) =>
                name.toLowerCase().replace(/\s/g, '_'),
            )
            const findPermissions = await this.permissionModel
                .find({
                    name: { $in: nombres },
                })
                .exec()

            const permissions = nombres
                .map(
                    (name) =>
                        new this.permissionModel({
                            name: name,
                        }),
                )
                .filter((perm) => {
                    return !findPermissions.some((p) => p.name === perm.name)
                })
            if (!permissions.length) {
                throw new BadRequestException('Todos los permisos ya existen.')
            }
            return this.permissionModel.insertMany(permissions)
        } catch (error) {
            isMongoError(error, Permission.name, names.toLocaleString())
            throw new InternalServerErrorException(
                'Error interno (distinto de la base de datos)',
            )
        }
    }

    async getAllPermissions(): Promise<PermissionDocument[]> {
        return this.permissionModel.find().exec()
    }
}
