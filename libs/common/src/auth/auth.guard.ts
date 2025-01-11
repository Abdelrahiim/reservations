import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { catchError, map, Observable, tap } from 'rxjs';
import { Request } from 'express';
import { Services } from '../constants';
import { ClientProxy } from '@nestjs/microservices';
import { Messages } from '../constants';

/**
 * AuthGuard is responsible for authenticating requests through different services.
 * It implements the CanActivate interface from NestJS to determine whether a request should be allowed to proceed.
 *
 * @class
 * @implements {CanActivate}
 *
 * @constructor
 * @param {ClientProxy} clientProxy - The client proxy to communicate with the authentication service.
 *
 * @method canActivate
 * @param {ExecutionContext} context - The execution context of the request.
 * @returns {boolean | Promise<boolean> | Observable<boolean>} - Returns a boolean, a Promise that resolves to a boolean, or an Observable that emits a boolean indicating whether the request is authenticated.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(Services.AUTH) private readonly clientProxy: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const jwt = request.cookies['Authorization'];
    if (!jwt) {
      return false;
    }
    return this.clientProxy
      .send(Messages.AUTHENTICATE, {
        Authorization: jwt,
      })
      .pipe(
        tap((user) => {
          request.user = user;
        }),
        catchError<boolean, any>(() => false),
        map(() => true),
      );
  }
}
