import { UnprocessableEntityException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

const CustomZodValidationPipe = createZodValidationPipe({
  // provide custom validation exception factory
  createValidationException: (error: unknown) => {
    const zodError = error as ZodError;
    return new UnprocessableEntityException(
      zodError.issues.map((err) => {
        return {
          ...err,
          path: err.path.join('.'),
        };
      })
    );
  },
});

export default CustomZodValidationPipe;
