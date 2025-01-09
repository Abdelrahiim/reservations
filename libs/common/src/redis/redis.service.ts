import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../constants/redis-client';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  /**
   * Sets a value in the Redis store.
   * @param key The key to store the value under.
   * @param value The value to store.
   * @returns A promise that resolves with the result of the SET operation.
   */
  async set(key: string, value: string, expiration?: number) {
    if (expiration) {
      return this.redis.set(key, value, 'EX', expiration);
    }
    return this.redis.set(key, value);
  }

  /**
   * Gets a value from the Redis store.
   * @param key The key to retrieve the value from.
   * @returns A promise that resolves with the retrieved value.
   */
  async get(key: string) {
    return this.redis.get(key);
  }

  /**
   * Sets a hash value in the Redis store.
   * @param key The key under which the hash is stored.
   * @param objectValue The object to store as a hash.
   * @returns A promise that resolves with the number of fields that were added.
   */
  async hSet<T extends object>(key: string, objectValue: T) {
    return this.redis.hset(key, objectValue);
  }

  async hGet<T>(key: string) {
    return this.redis.hgetall(key) as T;
  }
}
