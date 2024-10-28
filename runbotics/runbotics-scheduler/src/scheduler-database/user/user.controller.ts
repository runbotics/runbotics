import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, ParseIntPipe, Patch } from '@nestjs/common';
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


@Controller('/api/scheduler')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) {}

    @GetWithTenant('users/Page')
    getAllUsersByPageInTenant(
        @Param('tenantId') tenantId: Tenant['id'],
        @Specifiable(UserCriteria) specs: Specs<UserEntity>,
        @Pageable() paging: Paging
    ) {
        this.logger.log('REST request to get all users by page in tenant');
        specs.where = { ...specs.where, tenantId };
        return this.userService.findAllByPageWithSpecs(specs, paging);
    }

    @GetWithTenant('users')
    getAllUsersInTenant(@Param('tenantId') tenantId: Tenant['id']) {
        this.logger.log('REST request to get all users in tenant');
        return this.userService.findAllByTenant(tenantId);
    }

    @PatchWithTenant('users/:id')
    updateUserInTenant(
        @User() user: UserEntity,
        @Param('id', ParseIntPipe) userId: UserEntity['id'],
        @Body(new ZodValidationPipe(updateUserSchema)) userDto: UpdateUserDto
    ) {
        this.logger.log('REST request to update user in tenant');
        return this.userService.update(
            { ...userDto, tenantId: null },
            userId,
            user
        );
    }

    // -------------------------------------------

    @Get('users/Page')
    getAllUsersByPage(
        @Specifiable(UserCriteria) specs: Specs<UserEntity>,
        @Pageable() paging: Paging
    ) {
        this.logger.log('REST request to get all users by page');
        return this.userService.findAllByPageWithSpecs(specs, paging);
    }

    @Patch('users/:id')
    updateUser(
        @User() user: UserEntity,
        @Param('id', ParseIntPipe) userId: UserEntity['id'],
        @Body(new ZodValidationPipe(updateUserSchema)) userDto: UpdateUserDto
    ) {
        this.logger.log('REST request to update user');
        return this.userService.update(userDto, userId, user);
    }

    @Delete('users/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id', ParseIntPipe) userId: UserEntity['id']) {
        this.logger.log('REST request to delete user');
        await this.userService.delete(userId);
    }
}
