import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { App } from 'supertest/types'
import { AppModule } from '../../app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

describe('Documentation exist', () => {
    let app: INestApplication<App>

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        const config = new DocumentBuilder()
            .setTitle('Inventory System API')
            .setDescription('API para sistema de inventario')
            .setVersion('1.0')
            .addBearerAuth()
            .build()

        const document = SwaggerModule.createDocument(app, config)
        SwaggerModule.setup('api/v1/docs', app, document)
        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    it('Read /docs (GET)', () => {
        return request(app.getHttpServer()).get('/api/v1/docs').expect(200)
    })
})
