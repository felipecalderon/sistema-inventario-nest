import { BadRequestException } from '@nestjs/common'
import { isValidObjectId } from 'mongoose'

export const validateId = (id: string) => {
    if (!id) {
        throw new BadRequestException('Debe proporcionar el ID')
    }
    if (!isValidObjectId(id)) {
        throw new BadRequestException(
            'El ID proporcionado no es válido para MongoDB',
        )
    }
}
