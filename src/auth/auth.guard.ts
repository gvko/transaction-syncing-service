import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();

    if (!ctx.headers.authorizaiton) {
      return false;
    }

    ctx.user = await this.validateToken(ctx.headers.authorizaiton);
    return true;
  }

  async validateToken(auth: string): Promise<jwt.JwtPayload | string> {
    const [bearerPlaceholder, token] = auth.split(' ');

    if (bearerPlaceholder !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    try {
      return jwt.verify(token, config().auth.jwt.secret);
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
