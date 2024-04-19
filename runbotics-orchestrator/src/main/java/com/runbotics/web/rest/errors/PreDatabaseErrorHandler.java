package com.runbotics.web.rest.errors;

import com.runbotics.repository.*;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class PreDatabaseErrorHandler {

    private final UserRepository userRepository;

    private final ProcessRepository processRepository;

    private final ProcessCollectionRepository processCollectionRepository;

    private final GlobalVariableRepository globalVariableRepository;

    private final BotCollectionRepository botCollectionRepository;

    private final TagRepository tagRepository;

    public PreDatabaseErrorHandler(
        UserRepository userRepository,
        ProcessRepository processRepository,
        ProcessCollectionRepository processCollectionRepository,
        GlobalVariableRepository globalVariableRepository,
        BotCollectionRepository botCollectionRepository,
        TagRepository tagRepository
    ) {
        this.userRepository = userRepository;
        this.processRepository = processRepository;
        this.processCollectionRepository = processCollectionRepository;
        this.globalVariableRepository = globalVariableRepository;
        this.botCollectionRepository = botCollectionRepository;
        this.tagRepository = tagRepository;
    }

    public boolean tenantResourceRelationCheck(UUID tenantId) {
        boolean isRelationPresent =
            userRepository.countAllByTenantId(tenantId) != 0 ||
            processRepository.countAllByTenantId(tenantId) != 0 ||
            processCollectionRepository.countAllByTenantId(tenantId) != 0 ||
            globalVariableRepository.countAllByTenantId(tenantId) != 0 ||
            botCollectionRepository.countAllByTenantId(tenantId) != 0 ||
            tagRepository.countAllByTenantId(tenantId) != 0;

        return isRelationPresent;
    }
}
