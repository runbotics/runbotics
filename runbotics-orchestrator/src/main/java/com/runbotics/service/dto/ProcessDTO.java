package com.runbotics.service.dto;

import com.fasterxml.jackson.annotation.JsonView;
import com.runbotics.domain.*;
import com.runbotics.domain.Process;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.Set;
import javax.persistence.Lob;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * A DTO for the {@link Process} entity.
 */
public class ProcessDTO implements Serializable {

    @JsonView(ProcessDTOViews.DefaultView.class)
    private Long id;

    @NotNull
    @NotBlank
    @JsonView(ProcessDTOViews.DefaultView.class)
    private String name;

    @Lob
    @JsonView(ProcessDTOViews.DefaultView.class)
    private String description;

    @Lob
    private String definition;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private Boolean isPublic;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private ZonedDateTime created;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private ZonedDateTime updated;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private ZonedDateTime lastRun;

    private String executionInfo;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private Boolean isAttended;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private Boolean isTriggerable;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private UserDTO createdBy;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private BotSystem system;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private BotCollection botCollection;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private UserDTO editor;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private Set<TagDTO> tags;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private Set<GlobalVariableDTO> globalVariables;

    @JsonView(ProcessDTOViews.DefaultView.class)
    private ProcessOutput outputType;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getUpdated() {
        return updated;
    }

    public void setUpdated(ZonedDateTime updated) {
        this.updated = updated;
    }

    public String getExecutionInfo() {
        return executionInfo;
    }

    public Boolean getIsAttended() {
        return isAttended;
    }

    public Boolean getIsTriggerable() {
        return isTriggerable;
    }

    public void setExecutionInfo(String executionInfo) {
        this.executionInfo = executionInfo;
    }

    public void setIsAttended(Boolean isAttended) {
        this.isAttended = isAttended;
    }

    public void setIsTriggerable(Boolean isTriggerable) {
        this.isTriggerable = isTriggerable;
    }

    public UserDTO getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserDTO createdBy) {
        this.createdBy = createdBy;
    }

    public BotSystem getSystem() {
        return system;
    }

    public void setSystem(BotSystem system) {
        this.system = system;
    }

    public BotCollection getBotCollection() {
        return botCollection;
    }

    public void setBotCollection(BotCollection botCollection) {
        this.botCollection = botCollection;
    }

    public ZonedDateTime getLastRun() {
        return lastRun;
    }

    public void setLastRun(ZonedDateTime lastRun) {
        this.lastRun = lastRun;
    }

    public UserDTO getEditor() {
        return editor;
    }

    public void setEditor(UserDTO editor) {
        this.editor = editor;
    }

    public Set<TagDTO> getTags() {
        return tags;
    }

    public void setTags(Set<TagDTO> tags) {
        this.tags = tags;
    }

    public Set<GlobalVariableDTO> getGlobalVariables() {
        return globalVariables;
    }

    public void setGlobalVariables(Set<GlobalVariableDTO> globalVariables) {
        this.globalVariables = globalVariables;
    }

    public ProcessOutput getOutputType() {
        return outputType;
    }

    public void setOutputType(ProcessOutput outputType) {
        this.outputType = outputType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProcessDTO)) {
            return false;
        }

        ProcessDTO processDTO = (ProcessDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, processDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore

    @Override
    public String toString() {
        return "ProcessDTO{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", description='" + description + '\'' +
            ", definition='" + definition + '\'' +
            ", isPublic=" + isPublic +
            ", created=" + created +
            ", updated=" + updated +
            ", lastRun=" + lastRun +
            ", executionInfo=" + executionInfo +
            ", isAttended=" + isAttended +
            ", isTriggerable=" + isTriggerable +
            ", createdBy=" + createdBy +
            ", system=" + system +
            ", editor=" + editor +
            ", tags=" + tags +
            ", outputType=" + outputType +
            '}';
    }
}
