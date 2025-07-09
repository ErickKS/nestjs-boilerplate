import { applyDecorators } from '@nestjs/common'
import { ApiParam } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { ZodObject, ZodTypeAny } from 'zod'

/**
 * Generates Swagger path parameter decorators based on a Zod object schema.
 *
 * Each key in the schema is transformed into an individual `@ApiParam` entry,
 * preserving metadata such as type and required status.
 *
 * This utility allows keeping source of truth in Zod while auto-generating Swagger docs.
 *
 * @param zodSchema - A Zod object schema defining expected path parameters
 * @returns Combined decorators for Swagger path parameters
 */
export function ApiParamFromZod(zodSchema: ZodObject<Record<string, ZodTypeAny>>) {
  const shape = zodSchema.shape
  const decorators = Object.entries(shape).map(([key, zodType]) => {
    return ApiParam({
      name: key,
      required: !zodType.isOptional(),
      schema: zodToOpenAPI(zodType as ZodTypeAny),
    })
  })
  return applyDecorators(...decorators)
}
