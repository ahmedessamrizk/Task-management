import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    return this.userModel.create({ name, email, password });
  }

  findOneById(id: UserDto["_id"]): Promise<User> {
    return this.userModel.findById(id);
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }
}
