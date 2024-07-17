import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './modules/categories/categories.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { UtilitiesModule } from './modules/utilities/utilities.module';
import * as path from 'path';
@Module({
  imports: [
    //forRoot() method is used to register the ConfigService provider which is responsible for reading from env
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../src/config/.env'),
      //to be accessed by all modules
      isGlobal: true,
    }),

    //connect to the database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DBURI'),
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    CategoriesModule,
    TasksModule,
    AuthModule,
    UtilitiesModule,
  ],
})
export class AppModule {}
