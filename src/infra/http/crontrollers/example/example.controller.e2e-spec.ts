import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('[POST] /example/:userId', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile()
    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should return 200 and echo the validated request', async () => {
    const userId = '8b6e9d0a-22f5-4b59-95dc-1caa4d9f7d35'
    const body = {
      name: 'John Doe',
      email: 'john.doe@example.com',
    }
    const query = {
      active: true,
      limit: 10,
    }
    const response = await request(app.getHttpServer()).post(`/example/${userId}`).query(query).send(body)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      message: 'Validated successfully',
      data: {
        params: { userId },
        query: {
          active: true,
          limit: 10,
        },
        body,
      },
    })
  })
})
