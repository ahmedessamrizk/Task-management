import { Expose, Transform } from 'class-transformer';
import mongoose from 'mongoose';

//this dto is responsible for excluding password from the response object
export class UserDto {
  @Expose()
  _id?: any;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
