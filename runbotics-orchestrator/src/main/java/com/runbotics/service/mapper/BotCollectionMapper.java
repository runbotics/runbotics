package com.runbotics.service.mapper;

import com.runbotics.domain.BotCollection;
import com.runbotics.service.dto.BotCollectionDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BotCollectionMapper extends EntityMapper<BotCollectionDTO, BotCollection> {

    BotCollectionDTO toDto(BotCollection botCollection);
}
