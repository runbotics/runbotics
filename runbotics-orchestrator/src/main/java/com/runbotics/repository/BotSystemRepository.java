package com.runbotics.repository;

import com.runbotics.domain.BotSystem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BotSystemRepository extends JpaRepository<BotSystem, String> {
}
