export enum QueueService {
  QUERY_SERVICE = 'query',
  BFF_WEB_SERVICE = 'bff-web',
  PRODUCT_SERVICE = 'product',
  NOTIFICATION_SERVICE = 'notification',
}

export enum QueueGroups {
  QUERY_GROUP = 'query-group',
  USER_ACCESS_GROUP = 'user-access-group',
}

enum CategoryQueueTopics {
  CREATE_CATEGORY = 'create_category',
  UPDATE_CATEGORY = 'update_category',
  DELETE_CATEGORY = 'delete_category',
}

enum ProductQueueTopics {
  CREATE_PRODUCT = 'create_product',
  UPDATE_PRODUCT = 'update_product',
  DELETE_PRODUCT = 'delete_product',
}

enum BrandQueueTopics {
  CREATE_BRAND = 'create_brand',
  UPDATE_BRAND = 'update_brand',
  DELETE_BRAND = 'delete_brand',
}

enum AttributeQueueTopics {
  CREATE_ATTRIBUTE = 'create_attribute',
  UPDATE_ATTRIBUTE = 'update_attribute',
  DELETE_ATTRIBUTE = 'delete_attribute',
}

enum ShipsFromQueueTopics {
  CREATE_SHIPS_FROM = 'create_ships_from',
  UPDATE_SHIPS_FROM = 'update_ships_from',
  DELETE_SHIPS_FROM = 'delete_ships_from',
}

enum UserAccessQueueTopics {
  SEND_OTP = 'send_otp',
}

enum NotificationQueueTopics {
  CREATE_NOTIFICATION = 'create_notification',
  READ_NOTIFICATION = 'read_notification',
  DELETE_NOTIFICATION = 'delete_notification',
}

export const QueueTopics = {
  CATEGORY: CategoryQueueTopics,
  PRODUCT: ProductQueueTopics,
  BRAND: BrandQueueTopics,
  USER_ACCESS: UserAccessQueueTopics,
  ATTRIBUTE: AttributeQueueTopics,
  SHIPS_FROM: ShipsFromQueueTopics,
  NOTIFICATION: NotificationQueueTopics,
} as const;
