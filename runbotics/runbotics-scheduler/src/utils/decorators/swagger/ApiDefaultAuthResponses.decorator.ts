import { applyDecorators } from '@nestjs/common';
import { ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';

export function ApiDefaultAuthResponses() {
    return applyDecorators(
        ApiUnauthorizedResponse({
            description:
                'The user is not authorized (missing or invalid token).',
        }),
        ApiForbiddenResponse({
            description: 'The user does not have sufficient permissions.',
        })
    );
}
