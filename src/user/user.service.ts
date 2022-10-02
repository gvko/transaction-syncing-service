import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user-input.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userEntity: Repository<UserEntity>) {
  }

  async create(dto: CreateUserInput): Promise<UserEntity> {
    return this.userEntity
      .create({
        name: dto.name,
        lastName: dto.lastName,
        walletAddress: dto.walletAddress.toLowerCase(),
        dob: dto.dob,
      })
      .save();
  }

  async getByWalletAddress(walletAddress: string): Promise<UserEntity> {
    return this.userEntity.findOneByOrFail({ walletAddress: walletAddress.toLowerCase() });
  }
}
