import { z } from 'zod';

export const VariantSchema = z.object({
  value: z.string().trim(),
  options: z.array(z.string().trim()),
});

export const VariantsProductSchema = z
  .array(VariantSchema)
  .superRefine((variants, ctx) => {
    //Kiểm tra variants và variant option có bị trùng không
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const isExistingVariant =
        variants.findIndex(
          (v) => v.value.toLowerCase() === variant.value.toLowerCase()
        ) !== i;
      if (isExistingVariant) {
        return ctx.addIssue({
          code: 'custom',
          message: `Giá trị ${variant.value} đã tồn tại trong danh sách variants`,
        });
      }

      const isDifferentOption = variant.options.some((option, index) => {
        const isExistingOption =
          variant.options.findIndex(
            (o) => o.toLowerCase() === option.toLowerCase()
          ) !== index;
        return isExistingOption;
      });
      if (isDifferentOption) {
        return ctx.addIssue({
          code: 'custom',
          message: `Variant ${variant.value} chứa các option trùng`,
        });
      }
    }
  });

export const AttributeProductSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export const AttributesProductSchema = z
  .array(AttributeProductSchema)
  .superRefine((attrs, ctx) => {
    const seenKeys = new Set<string>();
    for (const attr of attrs) {
      const key = attr.key.trim().toLowerCase();

      // Check trùng key
      if (seenKeys.has(key)) {
        ctx.addIssue({
          code: 'custom',
          message: `Thuộc tính "${attr.key}" bị trùng.`,
        });
      } else {
        seenKeys.add(key);
      }

      // Key rỗng
      if (!attr.key.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: `Key không được để trống.`,
        });
      }

      // Value rỗng
      if (!attr.value.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: `Giá trị của thuộc tính "${attr.key}" không được để trống.`,
        });
      }
    }
  });

export type VariantsProduct = z.infer<typeof VariantsProductSchema>;
export type AttributesProduct = z.infer<typeof AttributesProductSchema>;
