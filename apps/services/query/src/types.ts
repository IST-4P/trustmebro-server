import { OrderItemResponse } from '@common/interfaces/models/order';
import { Metadata as MetadataType } from '@common/schemas/notification';
import {
  AttributesProduct as AttributesProductType,
  Category as CategoryType,
  SKU as SkuType,
  VariantsProduct as VariantsProductType,
} from '@common/schemas/product';

declare global {
  namespace PrismaJson {
    type Categories = Pick<
      CategoryType,
      'id' | 'name' | 'logo' | 'parentCategoryId'
    >[];
    type Variants = VariantsProductType;
    type Attributes = AttributesProductType;
    type Skus = Pick<SkuType, 'id' | 'value' | 'price' | 'stock' | 'image'>[];
    type Metadata = MetadataType;
    type OrderItems = Pick<
      OrderItemResponse,
      | 'productName'
      | 'productImage'
      | 'skuValue'
      | 'quantity'
      | 'price'
      | 'productId'
    >[];
  }
}
