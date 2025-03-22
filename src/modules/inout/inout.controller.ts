import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { InOutService } from './inout.service'
import { CreateInOutDto } from './dto/create-inout.dto'
import { InOut } from './inout.schema'

@ApiTags('inout')
@Controller('inout')
export class InOutController {
    constructor(private readonly inOutService: InOutService) {}

    @Post()
    @ApiResponse({ status: 201, description: 'Registro creado correctamente.' })
    async create(@Body() createInOutDto: CreateInOutDto): Promise<InOut> {
        return this.inOutService.createRecord(createInOutDto)
    }

    @Get('user/:userId')
    async getRecordsByUser(
        @Param('userId') userId: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ): Promise<InOut[]> {
        return this.inOutService.getRecordsByUser(
            userId,
            startDate ? new Date(startDate) : undefined,
            endDate ? new Date(endDate) : undefined,
        )
    }

    // Puedes agregar otros endpoints para reportes y estadísticas
}
