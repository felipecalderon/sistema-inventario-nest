import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    RequestTimeoutException,
} from '@nestjs/common'

export function isMongoError(
    error: unknown,
    dbname: string,
    name: string,
): void {
    if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code: unknown }).code === 'number'
    ) {
        switch (error.code) {
            case 11000:
                throw new ConflictException(`${dbname}: "${name}" ya existe.`)
            case 121:
                throw new BadRequestException(
                    'Error de validación de esquema en MongoDB.',
                )
            case 2:
                throw new BadRequestException('Consulta malformada en MongoDB.')
            case 50:
                throw new RequestTimeoutException(
                    'Operación en MongoDB excedió el tiempo límite.',
                )
            case 43:
                throw new RequestTimeoutException(
                    'Operación en MongoDB se saturó.',
                )
            default:
                throw new InternalServerErrorException(`Error de MongoDB`)
        }
    }
    console.log(error)
    throw new InternalServerErrorException(`Error interno. ${error as string}`)
}
