import { BrandResponse } from '@common/interfaces/models/product';

export const BrandMapper = (data: BrandResponse) => {
  return {
    id: data.id,
    name: data.name,
    logo: data.logo,
    categories: null,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
};
