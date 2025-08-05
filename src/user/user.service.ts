import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { SignUpDto } from './../auth/dto/sign-up.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async findByEmail(email: string): Promise<User | null> {
    try {
      return this.userRepository.findOneBy({ email });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  public async findById(id: string): Promise<User | null> {
    try {
      return this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  public async createUser(data: SignUpDto, hash: string): Promise<User> {
    try {
      const user = this.userRepository.create({
        ...data,
        passwordHash: hash,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  public async verifyUserByEmail(email: string): Promise<void> {
    try {
      await this.userRepository.update({ email }, { isEmailVerified: true });
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  public async updatePassword(email: string, password: string): Promise<void> {
    try {
      await this.userRepository.update(
        { email },
        { passwordHash: await hash(password, 10) },
      );
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }
}
