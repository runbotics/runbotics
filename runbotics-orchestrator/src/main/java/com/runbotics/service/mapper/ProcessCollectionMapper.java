package com.runbotics.service.mapper;

import com.runbotics.domain.BotCollection;
import com.runbotics.domain.ProcessCollection;
import com.runbotics.service.ProcessCollectionService;
import com.runbotics.service.dto.BotCollectionDTO;
import com.runbotics.service.dto.ProcessCollectionDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProcessCollectionMapper extends EntityMapper<ProcessCollectionDTO, ProcessCollection> {

    ProcessCollectionDTO toDto(ProcessCollection processCollection);

}
