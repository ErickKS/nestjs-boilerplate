import { ZodRequestValidationPipe } from '@/infra/http/pipes/zod-request-validation.pipe'
import { Body, Controller, HttpCode, Param, Post, Query, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ApiQueryFromZod } from '../../decorators/api-query-from-zod.decorator'

export const exampleParamsSchema = z.object({
  userId: z.string().uuid(),
})
type ExampleParams = z.infer<typeof exampleParamsSchema>

export const exampleQuerySchema = z.object({
  active: z.coerce.boolean().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
})
type ExampleQuery = z.infer<typeof exampleQuerySchema>

export const exampleBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
})
type ExampleBody = z.infer<typeof exampleBodySchema>

export const exampleResponseSchema = z.object({
  message: z.literal('Validated successfully'),
  data: z.object({
    params: exampleParamsSchema,
    query: exampleQuerySchema,
    body: exampleBodySchema,
  }),
})

@ApiTags('Example')
@Controller('/example/:userId')
export class ExampleController {
  @Post()
  @HttpCode(200)
  @ExampleController.swagger()
  @UsePipes(
    new ZodRequestValidationPipe({
      body: exampleBodySchema,
      param: exampleParamsSchema,
      query: exampleQuerySchema,
    })
  )
  async handle(@Param() params: ExampleParams, @Query() query: ExampleQuery, @Body() body: ExampleBody) {
    return {
      message: 'Validated successfully',
      data: {
        params,
        query,
        body,
      },
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Example endpoint with full validation and Swagger docs',
        description: 'This is an nice endpoint!',
      }),
      ApiBody({ schema: zodToOpenAPI(exampleBodySchema) }),
      ApiParamFromZod(exampleParamsSchema),
      ApiQueryFromZod(exampleQuerySchema),
      ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(exampleResponseSchema) }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}
