import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiProcessPageFilters() {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, type: Number, example: 0 }),
    ApiQuery({ name: 'size', required: false, type: Number, example: 20 }),
    ApiQuery({ name: 'id.equals', required: false, type: Number, example: 42 }),
    ApiQuery({ name: 'name.contains', required: false, type: String, example: 'invoice' }),
    ApiQuery({ name: 'isPublic.equals', required: false, type: Boolean, example: true }),
    ApiQuery({ name: 'created.greaterThan', required: false, type: String, example: '2024-01-01T00:00:00Z' }),
    ApiQuery({ name: 'updated.lessThan', required: false, type: String, example: '2025-01-01T00:00:00Z' }),
    ApiQuery({ name: 'processCollectionId.equals', required: false, type: String, example: 'uuid-example' }),
    ApiQuery({ name: 'createdBy.id.equals', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'createdBy.email.contains', required: false, type: String, example: 'admin@example.com' }),
    ApiQuery({ name: 'tags.name.equals', required: false, type: String, example: 'finance' }),
    ApiQuery({ name: 'botCollection.name.equals', required: false, type: String, example: 'SAP Bots' }),
  );
}
