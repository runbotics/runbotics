package com.runbotics.service.dto;

import com.runbotics.domain.Tag;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.runbotics.domain.Tag} entity.
 */
public class TagDTO implements Serializable {

    private Long id;

    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TagDTO() {
        // Empty constructor needed for Jackson.
    }

    public TagDTO(Tag tag) {
        this.id = tag.getId();
        this.name = tag.getName();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TagDTO)) {
            return false;
        }

        TagDTO tagDTO = (TagDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, tagDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    @Override
    public String toString() {
        return "TagDTO{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ",}";
    }
}
