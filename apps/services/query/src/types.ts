import {
  AttributesProduct as AttributesProductType,
  Category as CategoryType,
  Sku as SkuType,
  VariantsProduct as VariantsProductType,
} from '@common/schemas/product';

declare global {
  namespace PrismaJson {
    type Categories = Pick<
      CategoryType,
      'id' | 'name' | 'logo' | 'parentCategoryId'
    >;
    type Variants = VariantsProductType;
    type Attributes = AttributesProductType;
    type Skus = Pick<SkuType, 'id' | 'value' | 'price' | 'stock' | 'image'>[];
  }
}
