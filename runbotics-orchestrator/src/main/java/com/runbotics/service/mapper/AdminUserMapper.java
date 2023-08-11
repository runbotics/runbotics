package com.runbotics.service.mapper;

import com.runbotics.domain.User;
import com.runbotics.service.dto.AdminUserDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AdminUserMapper extends EntityMapper<AdminUserDTO, User> {}
