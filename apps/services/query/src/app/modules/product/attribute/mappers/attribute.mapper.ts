import { AttributeResponse } from '@common/interfaces/models/product';

export const AttributeMapper = (data: AttributeResponse) => {
  return {
    id: data.id,
    name: data.name,
    url: data.url || undefined,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
};

export type AttributeMapperType = ReturnType<typeof AttributeMapper>;
