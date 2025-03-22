import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InOut, InOutSchema } from './inout.schema'
import { InOutController } from './inout.controller'
import { InOutService } from './inout.service'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: InOut.name, schema: InOutSchema }]),
    ],
    controllers: [InOutController],
    providers: [InOutService],
})
export class InoutModule {}
