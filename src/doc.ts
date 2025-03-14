import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const documentation = (app: NestFastifyApplication): void => {
    // Documentación
    const config = new DocumentBuilder()
        .setTitle('Inventory System API')
        .setDescription('API para sistema de inventario')
        .setVersion('1.0')
        .addBearerAuth()

        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/v1/docs', app, document, {
        swaggerOptions: {
            displayRequestDuration: true, // Muestra duración de las peticiones
            showExtensions: true, // extensiones en los esquemas de OpenAPI
            showCommonExtensions: true, // extensiones comunes de OpenAPI
        },
        customSiteTitle: 'Inventory System API Docs',
    })
}
