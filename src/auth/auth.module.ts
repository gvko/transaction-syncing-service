import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [],
  providers: [AuthResolver],
  exports: [],
})
export class AuthModule {
}
