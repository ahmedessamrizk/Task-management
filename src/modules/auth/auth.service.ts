import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { SigninDto } from '../users/dtos/signin.dto';
import { User } from '../users/entities/user.schema';

//used to hash password by passing parameters: password, salt and length of returned hash
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    //check if email already exists
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('email already in use');
    }

    //generate salt
    const salt = randomBytes(8).toString('hex');

    //hash (password + salt)
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    //create user
    return this.usersService.create({ name, email, password: result });
  }

  async signin(signinDto: SigninDto): Promise<any> {
    const { email, password } = signinDto;
    const user = await this.usersService.findOneByEmail(email);

    //check if user exists
    if (!user) {
      throw new BadRequestException('email password mismatch');
    }

    //extract salt and hash from stored user password
    const [salt, storedHash] = user.password.split('.');

    //hash incoming password
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //compare stored hash with incoming hash
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('email password mismatch');
    }

    return user;
  }
}
