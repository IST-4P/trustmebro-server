import { PrismaErrorValues } from '@common/constants/prisma.constant';
import {
  CheckParticipantExistsRequest,
  CheckParticipantExistsResponse,
  CreateUserRequest,
  GetUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '@common/interfaces/models/user-access';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async find(data: GetUserRequest): Promise<UserResponse> {
    try {
      const user = await this.userRepository.find(data);
      return user;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.UserNotFound');
      }
      throw error;
    }
  }

  async create(data: CreateUserRequest): Promise<UserResponse> {
    return this.userRepository.create(data);
  }

  async update(data: UpdateUserRequest): Promise<UserResponse> {
    try {
      const user = await this.userRepository.update(data);
      return user;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.UserNotFound');
      }

      if (error.code === PrismaErrorValues.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new NotFoundException('Error.UserAlreadyExists');
      }

      throw error;
    }
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
