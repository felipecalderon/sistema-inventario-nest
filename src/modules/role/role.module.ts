import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RolesService } from './role.service'
import { Role, RoleSchema } from './role.schema'
import { RoleController } from './role.controller'
import { PermissionsModule } from './permissions/permission.module'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
        PermissionsModule,
    ],
    controllers: [RoleController],
    providers: [RolesService],
    exports: [RolesService],
})
export class RolesModule {}
