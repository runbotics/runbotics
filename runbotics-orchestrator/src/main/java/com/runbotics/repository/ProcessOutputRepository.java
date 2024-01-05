package com.runbotics.repository;

import com.runbotics.domain.ProcessOutput;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessOutputRepository extends JpaRepository<ProcessOutput, String> {
}
