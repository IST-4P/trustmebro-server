import {
  CreateCategoryAttributeRequest,
  DeleteCategoryAttributeRequest,
  GetCategoryAttributeRequest,
  GetManyCategoryAttributesRequest,
  UpdateCategoryAttributeRequest,
} from '@common/interfaces/models/product';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryAttributeRepository } from '../repositories/category-attribute.repository';

@Injectable()
export class CategoryAttributeService {
  constructor(
    private readonly categoryAttributeRepository: CategoryAttributeRepository
  ) {}

  async list(data: GetManyCategoryAttributesRequest) {
    return this.categoryAttributeRepository.list(data);
  }

  async findById(data: GetCategoryAttributeRequest) {
    const categoryAttribute = await this.categoryAttributeRepository.findById(
      data.id
    );
    if (!categoryAttribute) {
      throw new NotFoundException('Error.CategoryAttributeNotFound');
    }
    return categoryAttribute;
  }

  async create(data: CreateCategoryAttributeRequest) {
    const categoryAttribute =
      await this.categoryAttributeRepository.findByCategoryAndAttribute(
        data.categoryId,
        data.attributeId
      );

    if (categoryAttribute) {
      throw new ConflictException('Error.CategoryAttributeAlreadyExists');
    }

    return this.categoryAttributeRepository.create({
      category: {
        connect: { id: data.categoryId },
      },
      attribute: {
        connect: { id: data.attributeId },
      },
      isRequired: data.isRequired,
    });
  }

  async update(data: UpdateCategoryAttributeRequest) {
    const categoryAttribute = await this.categoryAttributeRepository.findById(
      data.id
    );
    if (!categoryAttribute) {
      throw new NotFoundException('Error.CategoryAttributeNotFound');
    }

    return this.categoryAttributeRepository.update(data.id, {
      isRequired: data.isRequired,
    });
  }

  async delete(data: DeleteCategoryAttributeRequest) {
    const categoryAttribute = await this.categoryAttributeRepository.findById(
      data.id
    );
    if (!categoryAttribute) {
      throw new NotFoundException('Error.CategoryAttributeNotFound');
    }
    return this.categoryAttributeRepository.delete(data.id);
  }
}
