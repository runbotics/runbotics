package com.runbotics.repository;

import com.runbotics.domain.GlobalVariable;
import com.runbotics.domain.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface GuestRepository extends JpaRepository<Guest, String>, JpaSpecificationExecutor<Guest> {

}
