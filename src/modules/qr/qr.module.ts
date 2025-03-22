import { Module } from '@nestjs/common'
import { QrService } from './qr.service'
import { QrController } from './qr.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [QrController],
    providers: [QrService],
})
export class QrModule {}
