import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userEntity: Repository<UserEntity>) {
  }

  async create(name: string, lastName: string, walletAddress: string): Promise<UserEntity> {
    return this.userEntity.create({ name, lastName, walletAddress });
  }

  async getByWalletAddress(walletAddress: string): Promise<UserEntity> {
    return this.userEntity.findOneByOrFail({ walletAddress });
  }
}
