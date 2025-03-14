import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common'
import { CreateRoleDTO } from './dto/create-role.dto'
import { RolesService } from './role.service'

@Controller('roles')
export class RoleController {
    constructor(private readonly rolesService: RolesService) {}

    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDTO) {
        return await this.rolesService.createRole(createRoleDto)
    }

    @Post('permissions')
    async createPermission(@Body() name: string) {
        return await this.rolesService.createPermission(name)
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
}
