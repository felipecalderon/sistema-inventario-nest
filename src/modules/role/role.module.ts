import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RolesService } from './role.service'
import { Role, RoleSchema } from './role.schema'
import { RoleController } from './role.controller'
import { Permission, PermissionSchema } from './permission.schema'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
        MongooseModule.forFeature([
            { name: Permission.name, schema: PermissionSchema },
        ]),
    ],
    controllers: [RoleController],
    providers: [RolesService],
    exports: [RolesService],
})
export class RolesModule {}
