import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { toDataURL } from 'qrcode'
import { randomInt } from 'node:crypto'

@Injectable()
export class QrService {
    constructor(
        private config: ConfigService,
        private jwt: JwtService,
    ) {}
    async create() {
        try {
            const frontURL: string | undefined = this.config.get('FRONT_URL')
            if (!frontURL) {
                throw new NotFoundException('FRONT_URL env not found')
            }
            const random = randomInt(100, 1000)
            const token = this.jwt.sign({ random }, { expiresIn: '30m' })
            const url = `${frontURL}/acceso?token=${token}`
            const qrText = await toDataURL(url, {
                scale: 10,
                margin: 2,
                errorCorrectionLevel: 'H',
                type: 'image/webp',
            })
            return qrText
        } catch (error) {
            throw new Error(`Error generando QR: ${error}`)
        }
    }
}
