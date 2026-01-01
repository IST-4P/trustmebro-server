import { CategoryResponse } from '@common/interfaces/models/product';

export const CategoryMapper = (data: CategoryResponse) => {
  const parentId = data.parentCategory?.id ?? null;
  return {
    id: data.id,
    name: data.name,
    logo: data.logo,
    parentId,
    path: parentId ? `${data.parentCategory.name}/${data.name}` : null,
    level: parentId ? 1 : 0,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
};
