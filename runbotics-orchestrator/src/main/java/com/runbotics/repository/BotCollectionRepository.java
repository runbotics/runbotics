package com.runbotics.repository;

import com.runbotics.domain.BotCollection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@SuppressWarnings("unused")
@Repository
public interface BotCollectionRepository extends JpaRepository<BotCollection, UUID>, JpaSpecificationExecutor<BotCollection> {
    BotCollection getBotCollectionByName(String name);

    List<BotCollection> findDistinctByCreatedByLoginOrUsers_Login(String login, String login1);
    Page<BotCollection> findDistinctByCreatedByLoginOrUsers_Login(String login, String login1, Pageable pageable);
    Page<BotCollection> findDistinctByPublicBotsIncludedAndCreatedByLoginOrUsers_Login(
        boolean publicBotsIncluded,
        String login,
        String login1,
        Pageable pageable
    );
    Page<BotCollection> findDistinctByCreatedByLoginContains(String login, Pageable pageable);
}
