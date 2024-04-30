package com.runbotics.service.mapper;

import com.runbotics.domain.Tenant;
import com.runbotics.service.dto.TenantDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {})
public interface TenantMapper extends EntityMapper<TenantDTO, Tenant> {
    @BeanMapping(qualifiedByName = "DTO")
    TenantDTO toDto(Tenant tenant);
}
