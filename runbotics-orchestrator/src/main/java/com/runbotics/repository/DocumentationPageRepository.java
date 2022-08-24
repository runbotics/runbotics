package com.runbotics.repository;

import com.runbotics.domain.DocumentationPage;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the DocumentationPage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DocumentationPageRepository extends JpaRepository<DocumentationPage, Long>, JpaSpecificationExecutor<DocumentationPage> {}
