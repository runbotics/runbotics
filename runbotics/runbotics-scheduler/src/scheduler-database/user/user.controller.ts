import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { GetWithTenant, PatchWithTenant } from '#/utils/decorators/with-tenant.decorator';
import { Specifiable, Specs } from '#/utils/specification/specifiable.decorator';
import { UserCriteria } from './criteria/user.criteria';
import { User as UserEntity } from './user.entity';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import { Tenant } from '../tenant/tenant.entity';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { User } from '#/utils/decorators/user.decorator';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';


@Controller('/api/scheduler')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @GetWithTenant('users/Page')
    @FeatureKeys(FeatureKey.TENANT_READ_USER)
    getAllUsersByPageInTenant(
        @Param('tenantId') tenantId: Tenant['id'],
        @Specifiable(UserCriteria) specs: Specs<UserEntity>,
        @Pageable() paging: Paging
    ) {
        specs.where = { ...specs.where, tenantId };
        return this.userService.findAllByPageWithSpecs(specs, paging);
    }

    @GetWithTenant('users')
    @FeatureKeys(FeatureKey.TENANT_READ)
    getAllActivatedUsersInTenant(@Param('tenantId') tenantId: Tenant['id']) {
        return this.userService.findAllActivatedByTenant(tenantId);
    }

    @PatchWithTenant('users/:id')
    @FeatureKeys(FeatureKey.TENANT_EDIT_USER)
    updateUserInTenant(
        @User() user: UserEntity,
        @Param('id', ParseIntPipe) userId: UserEntity['id'],
        @Body(new ZodValidationPipe(updateUserSchema)) userDto: UpdateUserDto
    ) {
        return this.userService.update(
            { ...userDto, tenantId: null },
            userId,
            user
        );
    }

    // -------------- ENDPOINTS FOR ADMIN ------------------

    @Get('users/Page')
    @FeatureKeys(FeatureKey.USERS_PAGE_READ)
    getAllUsersByPage(
        @Specifiable(UserCriteria) specs: Specs<UserEntity>,
        @Pageable() paging: Paging
    ) {
        return this.userService.findAllByPageWithSpecs(specs, paging);
    }

    @Patch('users/:id')
    @FeatureKeys(FeatureKey.USERS_PAGE_READ)
    updateUser(
        @User() user: UserEntity,
        @Param('id', ParseIntPipe) userId: UserEntity['id'],
        @Body(new ZodValidationPipe(updateUserSchema)) userDto: UpdateUserDto
    ) {
        return this.userService.update(userDto, userId, user);
    }

    @Delete('users/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @FeatureKeys(FeatureKey.USERS_PAGE_READ)
    async deleteUser(@Param('id', ParseIntPipe) userId: UserEntity['id']) {
        await this.userService.delete(userId);
    }
}
