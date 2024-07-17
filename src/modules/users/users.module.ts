import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { AuthService } from '../auth/auth.service';
import { CurrentUserInterceptor } from './interceptors/user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UsersService,
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
