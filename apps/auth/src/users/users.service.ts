import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as becrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Create a new user.
   * @param createUserDto User data
   * @returns Created user
   * @throws {BadRequestException} if email already exists
   */
  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    if (await this.usersRepository.findEmailExists(email)) {
      throw new UnprocessableEntityException('Email already exists');
    }
    const hashPassword = await becrypt.hash(password, 10);

    const user = await this.usersRepository.create({
      email,
      password: hashPassword,
    });
    delete user.password;
    return user;
  }

  /**
   * Verify user credentials and return user data.
   * @param email User email
   * @param password User password
   * @throws {UnauthorizedException} if credentials are invalid
   */
  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const isMatch = await becrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  /**
   * Get user by ID.
   * @param id User ID
   * @returns User
   */
  public async getUserById(id: string) {
    return this.usersRepository.findOne({ _id: id });
  }
}
