import { z } from 'zod';

export const GenderValues = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export const GenderEnums = z.enum([
  GenderValues.MALE,
  GenderValues.FEMALE,
  GenderValues.OTHER,
]);

export const UserStatusValues = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
} as const;

export const UserStatusEnums = z.enum([
  UserStatusValues.ACTIVE,
  UserStatusValues.INACTIVE,
  UserStatusValues.BLOCKED,
]);

export const RoleNameValues = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
} as const;

export const RoleNameEnums = z.enum([
  RoleNameValues.CUSTOMER,
  RoleNameValues.SELLER,
  RoleNameValues.MANAGER,
  RoleNameValues.ADMIN,
]);
