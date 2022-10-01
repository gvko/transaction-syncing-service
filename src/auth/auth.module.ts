import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule],
  providers: [AuthResolver, AuthService],
  exports: [],
})
export class AuthModule {
}
