package com.runbotics.repository;

import com.runbotics.domain.Tag;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link Tag} entity.
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long>, JpaSpecificationExecutor<Tag> {
    Optional<Tag> findOneByName(String name);

    Optional<Tag> findOneByIdAndName(Long id, String name);

    @Query(value = "SELECT COUNT(*) FROM tag_process WHERE tag_process.tag_id = :id", nativeQuery = true)
    int countTags(Long id);
}
