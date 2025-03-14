import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '@/database/database.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { CompaniesModule } from '@/modules/companies/companies.module'
import { UsersModule } from '@/modules/users/users.module'
import { RolesModule } from '@/modules/role/role.module'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        DatabaseModule,
        AuthModule,
        CompaniesModule,
        UsersModule,
        RolesModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
