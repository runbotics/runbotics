package com.runbotics.service.mapper;

import com.runbotics.domain.NotificationBot;
import com.runbotics.service.dto.NotificationBotDTO;
import org.mapstruct.Mapper;

/**
 * Mapper for the entity {@link NotificationBot} and its DTO {@link NotificationBotDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface NotificationBotMapper extends EntityMapper<NotificationBotDTO, NotificationBot> {

    NotificationBotDTO toDto(NotificationBot notificationBot);

    NotificationBot toEntity(NotificationBotDTO notificationBotDTO);
}
