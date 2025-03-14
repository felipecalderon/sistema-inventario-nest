import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role, RoleDocument } from '@/modules/role/role.schema'
import {
    Permission,
    PermissionDocument,
} from '@/modules/role/permission.schema'
import { CreateRoleDTO } from './dto/create-role.dto'
import { Types } from 'mongoose'

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        @InjectModel(Permission.name)
        private permissionModel: Model<PermissionDocument>,
    ) {}

    async createRole(roleDto: CreateRoleDTO): Promise<RoleDocument> {
        console.log(roleDto)
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
            // Aquí asumimos que roleDto.permissions es un array de strings (p. ej.: nombres de permisos o IDs)
            // Puedes adaptar la lógica para decidir si buscas por nombre o por _id.
            const permission = await this.permissionModel
                .findOne({ name: permIdentifier })
                .exec()
            if (!permission) {
                // Podrías optar por crear el permiso si el superadmin lo permite o lanzar error.
                throw new BadRequestException(
                    `Permiso no encontrado: ${permIdentifier}`,
                )
            }
            permissionIds.push(permission._id)
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
        const role = await this.roleModel.findById(id)
        if (!role) throw new NotFoundException('Rol no encontrado.')

        if (role.immutable) {
            throw new BadRequestException(
                'No se puede eliminar un rol inmutable.',
            )
        }

        return this.roleModel.findByIdAndDelete(id).exec()
    }
}
