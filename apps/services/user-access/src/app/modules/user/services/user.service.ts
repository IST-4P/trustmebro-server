import { CreateUserRequest } from '@common/interfaces/models/user';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserRequest) {
    return this.userRepository.create(data);
  }
}
