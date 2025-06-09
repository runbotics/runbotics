import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { DeleteWithTenant, GetWithTenant, PatchWithTenant, PostWithTenant } from '#/utils/decorators/with-tenant.decorator';
import { Specifiable, Specs } from '#/utils/specification/specifiable.decorator';
import { UserCriteria } from './criteria/user.criteria';
import { User } from './user.entity';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { DeleteUserDto, deleteUserSchema } from './dto/delete-user.dto';
import { ActivateUserDto, activateUserSchema } from './dto/activate-user.dto';

@Controller('/api/scheduler')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @GetWithTenant('users/Page')
    @FeatureKeys(FeatureKey.TENANT_READ_USER)
    getAllUsersByPageInTenant(
        @UserDecorator() { tenantId }: User,
        @Specifiable(UserCriteria) specs: Specs<User>,
        @Pageable() paging: Paging,
    ) {
        specs.where = { ...specs.where, tenantId };
        return this.userService.findAllByPageWithSpecs(specs, paging);
    }

    @GetWithTenant('users')
    @FeatureKeys(FeatureKey.TENANT_READ)
    getAllActivatedUsersInTenant(
        @UserDecorator() { tenantId }: User,
    ) {
        return this.userService.findAllActivatedByTenant(tenantId);
    }

    @PatchWithTenant('users/:id')
    @FeatureKeys(FeatureKey.TENANT_EDIT_USER)
    updateUserInTenant(
        @UserDecorator() user: User,
        @Param('id', ParseIntPipe) userId: User['id'],
        @Body(new ZodValidationPipe(updateUserSchema)) userDto: UpdateUserDto,
    ) {
        return this.userService.update(
            {...userDto},
            userId,
            user
        );
    }

    @PostWithTenant('users/activate/:id')
    @FeatureKeys(FeatureKey.TENANT_EDIT_USER)
    activateUserInTenant(
        @UserDecorator() user: User,
        @Param('id', ParseIntPipe) userId: User['id'],
        @Body(new ZodValidationPipe(activateUserSchema)) userDto: ActivateUserDto,
    ) {
        return this.userService.activate(
            userDto,
            userId,
            user
        );
    }

    @DeleteWithTenant('users/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @FeatureKeys(FeatureKey.TENANT_DECLINE_USER)
    async deleteUserInTenant(
        @UserDecorator() user: User,
        @Param('id', ParseIntPipe) userId: User['id'],
        @Body(new ZodValidationPipe(deleteUserSchema)) userDto: DeleteUserDto,
    ) {
        await this.userService.deleteInTenant(userId, user, userDto);
    }

    // -------------- ENDPOINTS FOR ADMIN ------------------

    @Get('users/Page')
    @FeatureKeys(FeatureKey.MANAGE_INACTIVE_USERS, FeatureKey.MANAGE_ALL_TENANTS)
    getAllUsersByPage(
        @Specifiable(UserCriteria) specs: Specs<User>,
        @Pageable() paging: Paging,
    ) {
        return this.userService.findAllByPageWithSpecs(specs, paging);
    }

    @Patch('users/:id')
    @FeatureKeys(FeatureKey.MANAGE_INACTIVE_USERS, FeatureKey.MANAGE_ALL_TENANTS)
    updateUser(
        @UserDecorator() user: User,
        @Param('id', ParseIntPipe) userId: User['id'],
        @Body(new ZodValidationPipe(updateUserSchema)) userDto: UpdateUserDto
    ) {
        return this.userService.update(userDto, userId, user);
    }

    @Post('users/activate/:id')
    @FeatureKeys(FeatureKey.MANAGE_INACTIVE_USERS, FeatureKey.MANAGE_ALL_TENANTS)
    activateUser(
        @UserDecorator() user: User,
        @Param('id', ParseIntPipe) userId: User['id'],
        @Body(new ZodValidationPipe(activateUserSchema)) userDto: ActivateUserDto,
    ) {
        return this.userService.activate(
            userDto,
            userId,
            user
        );
    }


    @Delete('users/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @FeatureKeys(FeatureKey.MANAGE_INACTIVE_USERS, FeatureKey.MANAGE_ALL_TENANTS)
    async deleteUser(
        @Param('id', ParseIntPipe) userId: User['id'],
    ) {
        await this.userService.delete(userId);
    }
}
