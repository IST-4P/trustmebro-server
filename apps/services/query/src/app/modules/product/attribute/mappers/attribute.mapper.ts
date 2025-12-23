import { AttributeResponse } from '@common/interfaces/models/product';

export const AttributeMapper = (data: AttributeResponse) => {
  return {
    id: data.id,
    name: data.name,
    categoryIds: data.categories.map((c) => c.category.id),
    categories: data.categories.map((c) => {
      return {
        ...c.category,
        isRequired: c.isRequired,
      };
    }),
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
};

export type AttributeMapperType = ReturnType<typeof AttributeMapper>;
