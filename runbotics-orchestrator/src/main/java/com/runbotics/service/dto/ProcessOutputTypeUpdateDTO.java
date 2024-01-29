package com.runbotics.service.dto;

import com.runbotics.domain.ProcessOutput;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

public class ProcessOutputTypeUpdateDTO implements Serializable {

    @NotNull
    private Long id;

    @NotNull
    private ProcessOutput outputType;

    public ProcessOutputTypeUpdateDTO(Long id, ProcessOutput processOutput) {
        this.id = id;
        this.outputType = processOutput;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProcessOutput getOutputType() {
        return outputType;
    }

    public void setOutputType(ProcessOutput outputType) {
        this.outputType = outputType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProcessOutputTypeUpdateDTO that = (ProcessOutputTypeUpdateDTO) o;
        return Objects.equals(id, that.id) && Objects.equals(outputType, that.outputType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, outputType);
    }

    @Override
    public String toString() {
        return "ProcessOutputTypeUpdateDTO{" +
            "id=" + id +
            ", outputType=" + outputType +
            '}';
    }
}
