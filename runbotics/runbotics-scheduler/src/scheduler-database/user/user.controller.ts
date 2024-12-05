import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { GetWithTenant, PatchWithTenant } from '#/utils/decorators/with-tenant.decorator';
import { Specifiable, Specs } from '#/utils/specification/specifiable.decorator';
import { UserCriteria } from './criteria/user.criteria';
import { User } from './user.entity';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import { Tenant } from '../tenant/tenant.entity';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';


@Controller('/api/scheduler')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @GetWithTenant('users/Page')
    @FeatureKeys(FeatureKey.TENANT_READ_USER)
    getAllUsersByPageInTenant(
        @Param('tenantId') tenantId: Tenant['id'],
        @Specifiable(UserCriteria) specs: Specs<User>,
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
        @UserDecorator() user: User,
        @Param('id', ParseIntPipe) userId: User['id'],
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
    @FeatureKeys(FeatureKey.MANAGE_INACTIVE_USERS)
    getAllUsersByPage(
        @Specifiable(UserCriteria) specs: Specs<User>,
        @Pageable() paging: Paging
    ) {
        return this.userService.findAllByPageWithSpecs(specs, paging);
    }

    @Patch('users/:id')
    @FeatureKeys(FeatureKey.MANAGE_INACTIVE_USERS)
    updateUser(
        @UserDecorator() user: User,
        @Param('id', ParseIntPipe) userId: User['id'],
        @Body(new ZodValidationPipe(updateUserSchema)) userDto: UpdateUserDto
    ) {
        return this.userService.update(userDto, userId, user);
    }

    @Delete('users/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @FeatureKeys(FeatureKey.MANAGE_INACTIVE_USERS)
    async deleteUser(@Param('id', ParseIntPipe) userId: User['id']) {
        await this.userService.delete(userId);
    }
}
