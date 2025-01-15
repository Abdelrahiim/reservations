import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { catchError, map, of, tap } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '../types';

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
  private authService: AuthServiceClient;
  constructor(@Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies['Authorization'];
    if (!jwt) {
      return false;
    }
    return this.authService
      .authenticate({
        Authorization: jwt,
      })
      .pipe(
        tap((user) => {
          request.user = {
            ...user,
            _id: user.id,
          };
        }),
        catchError(() => of(false)),
        map(() => true),
      );
  }
}
