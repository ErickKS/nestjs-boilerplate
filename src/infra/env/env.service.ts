import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

/**
 * Wrapper around NestJS ConfigService for typed access to environment variables.
 *
 * Provides strongly typed access to environment variables defined in the `Env` interface.
 * Uses `infer: true` to enable automatic type inference from the Env interface.
 */
@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  /**
   * Retrieves a typed environment variable.
   *
   * @param key - The key from the Env interface to retrieve
   * @returns The value of the environment variable, with correct type inference
   */
  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true })
  }
}
