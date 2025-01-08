import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as becrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    // if (await this.usersRepository.findEmailExists(email)) {
    //   throw new BadRequestException('Email already exists');
    // }
    const hashPassword = await becrypt.hash(password, 10);

    const user = await this.usersRepository.create({
      email,
      password: hashPassword,
    });
    delete user.password;
    return user;
    // TODO: generate token
  }
}
