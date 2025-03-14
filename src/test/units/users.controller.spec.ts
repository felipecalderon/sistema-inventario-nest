// src/users/users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../../modules/users/users.controller'
import { UsersService } from '../../modules/users/users.service'
import { CreateUserDto } from '../../modules/users/dto/create-user.dto'
import { UpdateUserDto } from '../../modules/users/dto/update-user.dto'

describe('UsersController', () => {
    let controller: UsersController
    let service: UsersService

    const mockUser = {
        _id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'secret',
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    const mockUsersService = {
        create: jest.fn((dto: CreateUserDto) =>
            Promise.resolve({ _id: '1', ...dto }),
        ),
        findAll: jest.fn(() => Promise.resolve([mockUser])),
        findOne: jest.fn((id: string) => Promise.resolve(mockUser)), // eslint-disable-line @typescript-eslint/no-unused-vars
        update: jest.fn((id: string, dto: UpdateUserDto) =>
            Promise.resolve({ _id: id, ...dto }),
        ),
        remove: jest.fn((id: string) => Promise.resolve(mockUser)), // eslint-disable-line @typescript-eslint/no-unused-vars
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile()

        controller = module.get<UsersController>(UsersController)
        service = module.get<UsersService>(UsersService)
        jest.clearAllMocks()
    })

    it('El servicio de user debe estar definido', () => {
        expect(service).toBeDefined()
    })

    describe('create', () => {
        it('Debe crear un usuario', async () => {
            const dto: CreateUserDto = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'secret',
            }

            const result = await controller.create(dto)
            expect(result).toEqual({ _id: '1', ...dto })
            expect(service.create).toHaveBeenCalledWith(dto) // eslint-disable-line
        })
    })

    describe('findAll', () => {
        it('Devuelve un arreglo con el usuario', async () => {
            const result = await controller.findAll()
            expect(result).toEqual([mockUser])
            expect(service.findAll).toHaveBeenCalledTimes(1) // eslint-disable-line
        })
    })

    describe('findOne', () => {
        it('Devuelve el usuario con el id', async () => {
            const result = await controller.findOne('1')
            expect(result).toEqual(mockUser)
            expect(service.findOne).toHaveBeenCalledWith('1') // eslint-disable-line
        })
    })

    describe('update', () => {
        it('Actualiza el usuario con el id', async () => {
            const dto: UpdateUserDto = {
                name: 'Updated User',
            }

            const result = await controller.update('1', dto)
            expect(result).toEqual({ _id: '1', ...dto })
            expect(service.update).toHaveBeenCalledWith('1', dto) // eslint-disable-line
        })
    })

    describe('remove', () => {
        it('Elimina el usuario con el id', async () => {
            const result = await controller.remove('1')
            expect(result).toEqual(mockUser)
            expect(service.remove).toHaveBeenCalledWith('1') // eslint-disable-line
        })
    })
})
