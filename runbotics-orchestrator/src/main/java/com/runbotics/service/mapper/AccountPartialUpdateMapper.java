package com.runbotics.service.mapper;

import com.runbotics.domain.User;
import com.runbotics.service.dto.AccountPartialUpdateDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountPartialUpdateMapper extends EntityMapper<AccountPartialUpdateDTO, User> {

    AccountPartialUpdateDTO toDto(User user);
}
