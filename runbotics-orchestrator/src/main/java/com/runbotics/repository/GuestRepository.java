package com.runbotics.repository;

import com.runbotics.domain.GlobalVariable;
import com.runbotics.domain.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface GuestRepository extends JpaRepository<Guest, String>, JpaSpecificationExecutor<Guest> {
    @Modifying
    @Query(value = "DELETE FROM jhi_user u WHERE u.id IN (SELECT user_id FROM guest)", nativeQuery = true)
    void deleteAllGuest();

    @Query(value = "SELECT * FROM guest WHERE user_id = ?1", nativeQuery = true)
    Optional<Guest> findGuestById(Long id);
}
