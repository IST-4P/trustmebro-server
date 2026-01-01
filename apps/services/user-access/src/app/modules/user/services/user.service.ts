import {
  CheckParticipantExistsRequest,
  CheckParticipantExistsResponse,
  CreateUserRequest,
  GetUserRequest,
} from '@common/interfaces/models/user';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async find(data: GetUserRequest) {
    return this.userRepository.find(data);
  }

  async createUser(data: CreateUserRequest) {
    return this.userRepository.create(data);
  }

  async checkParticipantExists({
    processId,
    ...data
  }: CheckParticipantExistsRequest): Promise<CheckParticipantExistsResponse> {
    const count = await this.userRepository.checkParticipantExists(
      data.participantIds
    );
    return { count };
  }
}
