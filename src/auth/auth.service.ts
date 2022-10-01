import { Injectable } from '@nestjs/common';
import type { UserEntity } from '../user/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor() {
  }

  async createToken({ id, walletAddress }: UserEntity): Promise<string> {
    // TODO: load JWT secret from env vars
    return jwt.sign({ id, walletAddress }, 'secret');
  }
}
