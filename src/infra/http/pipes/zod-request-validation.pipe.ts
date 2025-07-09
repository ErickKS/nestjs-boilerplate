import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

/**
 * Defines the Zod schemas for different request types.
 * Can include schemas for 'body', 'param', and 'query'.
 */
interface MultiZodSchema {
  body?: ZodSchema
  param?: ZodSchema
  query?: ZodSchema
}

/**
 * NestJS Pipe that performs validation using Zod schemas.
 * Accepts a set of optional schemas for different request parts (body, param, query)
 * and applies the appropriate validation based on the metadata type.
 *
 * If validation fails, a `BadRequestException` is thrown with detailed error output.
 */
export class ZodRequestValidationPipe implements PipeTransform {
  constructor(private schemas: MultiZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const schema = this.schemas[metadata.type as keyof MultiZodSchema]
    if (!schema) return value
    try {
      return schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }
      throw new BadRequestException({
        message: 'Validation failed',
        statusCode: 400,
      })
    }
  }
}
