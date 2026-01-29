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
      | 'id'
      | 'productName'
      | 'productImage'
      | 'skuValue'
      | 'quantity'
      | 'price'
      | 'productId'
    >[];
    type Reply = {
      id: string;
      reviewId: string;
      shopId: string;
      content: string;
      createdAt: string;
    };
    // type ReportEvidence = {
    //   reportId: string;
    //   url: string;
    //   evidenceType: string; // ví dụ: IMAGE | VIDEO | AUDIO | TEXT | OTHER
    //   note?: string | null;
    //   createdAt: string; // ISO
    //   updatedAt: string; // ISO
    // }[];
    // type ReportAction = {
    //   reportId: string;
    //   adminId: string;
    //   actionType: ReportActionType;
    //   reason?: string | null;
    //   createdAt: string;
    // }[];
    // type ReportHistory = {
    //   reportId: string;
    //   oldStatus: ReportStatusType;
    //   newStatus: ReportStatusType;
    //   adminId: string;
    //   note?: string | null;
    //   createdAt: string;
    // }[];
    // type ReportComment = {
    //   reportId: string;
    //   userId: string;
    //   role: string;
    //   comment: string;
    //   createdAt: string;
    // }[];
  }
}
