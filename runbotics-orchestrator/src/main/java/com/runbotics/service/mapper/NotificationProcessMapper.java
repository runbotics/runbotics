package com.runbotics.service.mapper;

import com.runbotics.domain.NotificationProcess;
import com.runbotics.service.dto.NotificationProcessDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity {@link NotificationProcess} and its DTO {@link NotificationProcessDTO}.
 */
@Mapper(componentModel = "spring", uses = {
    UserMapper.class,
    ProcessMapper.class
})
public interface NotificationProcessMapper extends EntityMapper<NotificationProcessDTO, NotificationProcess> {

    NotificationProcessDTO toDto(NotificationProcess notificationProcess);

    NotificationProcess toEntity(NotificationProcessDTO notificationProcessDTO);
}
