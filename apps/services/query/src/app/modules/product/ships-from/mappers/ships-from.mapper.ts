import { ShipsFromResponse } from '@common/interfaces/models/product';

export const ShipsFromMapper = (data: ShipsFromResponse) => {
  return {
    id: data.id,
    address: data.address,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
};
