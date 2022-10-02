import { Injectable } from '@nestjs/common';
import type { UserEntity } from '../user/user.entity';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';

@Injectable()
export class AuthService {
  async createToken({ id, walletAddress }: UserEntity): Promise<string> {
    const jwtConfig = config().auth.jwt;

    return jwt.sign({
        id,
        walletAddress,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn },
    );
  }
}
