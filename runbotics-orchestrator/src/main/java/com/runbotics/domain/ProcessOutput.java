package com.runbotics.domain;

import com.fasterxml.jackson.annotation.JsonView;
import com.runbotics.service.dto.ProcessDTOViews;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Objects;

@Entity
@Table(name = "process_output")
public class ProcessOutput {

    @NotNull
    @Size(max = 50)
    @Id
    @Column(length = 50)
    @JsonView(ProcessDTOViews.DefaultView.class)
    public String type;

    public ProcessOutput() {
    }

    public ProcessOutput(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProcessOutput that = (ProcessOutput) o;
        return Objects.equals(type, that.type);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type);
    }

    @Override
    public String toString() {
        return "ProcessOutput{" +
            "type='" + type + '\'' +
            '}';
    }

    public enum ProcessOutputType {
        JSON_OBJECT("JSON_OBJECT"),
        PLAIN_TEXT("PLAIN_TEXT");

        private final String type;

        ProcessOutputType(String type) {
            this.type = type;
        }

        public String value() {
            return this.type;
        }
    }
}
