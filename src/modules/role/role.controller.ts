import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Delete,
    Patch,
} from '@nestjs/common'
import { CreateRoleDTO } from './dto/create-role.dto'
import { RolesService } from './role.service'
import { PermissionsService } from './permissions/permission.service'

@Controller('roles')
export class RoleController {
    constructor(
        private readonly rolesService: RolesService,
        private readonly permissionService: PermissionsService,
    ) {}

    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDTO) {
        return await this.rolesService.createRole(createRoleDto)
    }

    @Patch(':id')
    async updateRolePermissions(
        @Param('id') id: string,
        @Body() { permissions }: { permissions: string[] },
    ) {
        return await this.rolesService.updateRolePermissions(id, permissions)
    }

    @Get(':id')
    async getRoleById(@Param('id') id: string) {
        return await this.rolesService.getRoleById(id)
    }

    @Get()
    async getAllRoles() {
        return await this.rolesService.getAllRoles()
    }

    @Delete(':id')
    async deleteRole(@Param('id') id: string) {
        return await this.rolesService.deleteRole(id)
    }

    @Get('permissions')
    async getAllPermissions() {
        return await this.permissionService.findPermissionsByIds()
    }

    @Post('permissions')
    async createPermission(@Body() { name }: { name: string | string[] }) {
        if (Array.isArray(name)) {
            return await this.permissionService.createBulkPermissions(name)
        }
        return await this.permissionService.createPermission(name)
    }

    @Delete('permissions/:id')
    async deletePermission(@Param('id') id: string) {
        return await this.permissionService.deletePermission(id)
    }
}
