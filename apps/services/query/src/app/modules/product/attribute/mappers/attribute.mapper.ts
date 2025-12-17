import { AttributeResponse } from '@common/interfaces/models/product';

export const AttributeMapper = (data: AttributeResponse) => {
  return {
    id: data.id,
    key: data.key,
    categories: null,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
};
