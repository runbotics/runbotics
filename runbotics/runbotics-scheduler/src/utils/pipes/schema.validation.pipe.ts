/* eslint-disable @typescript-eslint/no-explicit-any */
import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import {ObjectSchema } from 'yup';

@Injectable()
export class SchemaValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema<any>){}

    async transform(value: any, metaData: ArgumentMetadata) {
        if ('body' === metaData.type) {
            return await this.schema.validate(value);
        }
        return value;
    }
}