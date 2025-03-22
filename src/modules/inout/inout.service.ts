import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateInOutDto } from './dto/create-inout.dto'
import { InjectModel } from '@nestjs/mongoose'
import { InOutDocument, InOut } from './inout.schema'
import { Model } from 'mongoose'

@Injectable()
export class InOutService {
    constructor(
        @InjectModel(InOut.name)
        private readonly inOutModel: Model<InOutDocument>,
    ) {}

    async createRecord(createInOutDto: CreateInOutDto): Promise<InOut> {
        // Validación adicional: Ejemplo de secuencia lógica
        // Obtener el último registro del usuario para verificar la secuencia
        const lastRecord = await this.inOutModel
            .findOne({ user: createInOutDto.user })
            .sort({ timestamp: -1 })

        if (lastRecord && lastRecord.type === createInOutDto.type) {
            throw new BadRequestException(
                `No se puede registrar dos movimientos ${createInOutDto.type} consecutivos`,
            )
        }

        const newRecord = new this.inOutModel(createInOutDto)
        return newRecord.save()
    }

    async getRecordsByUser(
        userId: string,
        startDate?: Date,
        endDate?: Date,
    ): Promise<InOut[]> {
        const query: any = { user: userId }
        if (startDate && endDate) {
            query.timestamp = { $gte: startDate, $lte: endDate }
        }
        return this.inOutModel.find(query).sort({ timestamp: 1 }).exec()
    }

    // Otros métodos para reportes y cálculos
    async getDailyReport(userId: string, date: Date) {
        // Implementa la lógica para obtener registros de un día específico
    }
}
