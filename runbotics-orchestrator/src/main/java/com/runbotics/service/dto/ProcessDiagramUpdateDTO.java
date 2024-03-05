package com.runbotics.service.dto;

import javax.persistence.Lob;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

public class ProcessDiagramUpdateDTO implements Serializable {

    @NotNull
    private Long id;

    @Lob
    @NotBlank
    @NotNull
    private String definition;

    private List<String> globalVariableIds;

    private String executionInfo;

    public ProcessDiagramUpdateDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public List<String> getGlobalVariableIds() {
        return globalVariableIds;
    }

    public void setGlobalVariableIds(List<String> globalVariableIds) {
        this.globalVariableIds = globalVariableIds;
    }

    public String getExecutionInfo() {
        return executionInfo;
    }

    public void setExecutionInfo(String executionInfo) {
        this.executionInfo = executionInfo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProcessDiagramUpdateDTO that = (ProcessDiagramUpdateDTO) o;
        return Objects.equals(id, that.id) && Objects.equals(definition, that.definition) && Objects.equals(globalVariableIds, that.globalVariableIds) && Objects.equals(executionInfo, that.executionInfo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, definition, globalVariableIds, executionInfo);
    }

    @Override
    public String toString() {
        return "ProcessDiagramUpdateDTO{" +
            "id=" + id +
            ", definition='" + definition + '\'' +
            ", globalVariableIds=" + globalVariableIds +
            ", executionInfo='" + executionInfo + '\'' +
            '}';
    }
}
