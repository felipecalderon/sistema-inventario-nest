import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: () => ({
                uri: process.env.MONGO_URI,
            }),
        }),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule {}
