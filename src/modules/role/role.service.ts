import {
    Injectable,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role, RoleDocument } from '@/modules/role/role.schema'
import { CreateRoleDTO } from './dto/create-role.dto'
import { Types } from 'mongoose'
import { isMongoError } from '@/utils/validate-mongo-errors'
import { PermissionsService } from './permissions/permission.service'

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        private permissionService: PermissionsService,
    ) {}

    async createRole(roleDto: CreateRoleDTO): Promise<RoleDocument> {
        // No permitir crear otro "superusuario"
        if (roleDto.name.toLowerCase() === 'superusuario') {
            const superRole = await this.roleModel.findOne({
                name: 'superusuario',
            })
            if (superRole) {
                throw new BadRequestException(
                    'El rol "superusuario" ya existe y es inmutable.',
                )
            }
        }

        const existingRole = await this.roleModel
            .findOne({ name: roleDto.name })
            .exec()
        if (existingRole) {
            throw new BadRequestException('El rol ya existe.')
        }

        // Verificar que cada permiso exista en la colección de Permisos
        const permissionIds: Types.ObjectId[] = []
        for (const permIdentifier of roleDto.permissions) {
            const permission =
                await this.permissionService.findPermissionsByIds(
                    permIdentifier,
                )
            if (permission) {
                permissionIds.push(permission[0]._id)
            }
        }

        const newRole = await this.roleModel.create({
            name: roleDto.name,
            immutable: roleDto.immutable,
            isSuperAdmin: roleDto.isSuperAdmin || false,
            permissions: permissionIds,
        })

        return newRole.save()
    }

    async getRoleById(id: string): Promise<RoleDocument | null> {
        if (!id) return null
        return this.roleModel.findById(id).populate('permissions').exec()
    }

    async getAllRoles(): Promise<RoleDocument[]> {
        return this.roleModel.find().populate('permissions').exec()
    }

    async deleteRole(id: string): Promise<RoleDocument | null> {
        try {
            const role = await this.roleModel.findById(id)
            if (!role) throw new NotFoundException('Rol no encontrado.')

            if (role.immutable) {
                throw new BadRequestException(
                    'No se puede eliminar un rol inmutable.',
                )
            }

            return this.roleModel.findByIdAndDelete(id).exec()
        } catch (error) {
            isMongoError(error, Role.name, id)
            throw new InternalServerErrorException(
                'Error interno (distinto de la base de datos)',
            )
        }
    }

    async updateRolePermissions(
        id: string,
        permissions: string[],
    ): Promise<RoleDocument | null> {
        try {
            const role = await this.roleModel
                .findById(id)
                .populate('permissions')
                .exec()
            if (!role) {
                throw new NotFoundException('Rol no encontrado.')
            }
            const findPermissions =
                await this.permissionService.findPermissionsByIds(permissions)
            if (findPermissions.length !== permissions.length) {
                throw new BadRequestException('Algunos permisos no existen.')
            }
            role.permissions = findPermissions.map((p) => p._id)
            return role.save()
        } catch (error) {
            isMongoError(error, Role.name, id)
            throw new InternalServerErrorException(
                'Error interno (distinto de la base de datos)',
            )
        }
    }
}
