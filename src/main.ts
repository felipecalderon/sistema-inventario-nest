import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { documentation } from '@/doc'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({ logger: false }),
    )

    // CORS
    app.enableCors()

    // Prefijo global
    app.setGlobalPrefix('api')

    // Global trnasformers para DTO's
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    )
    const config = app.get(ConfigService)
    const strPort: string | undefined = config.get('PORT')
    const port: number = strPort ? parseInt(strPort) : 3001
    documentation(app)
    await app.listen(port, '0.0.0.0')
    console.log(`dife-back is running on port ${port}`)
}

bootstrap() // eslint-disable-line
