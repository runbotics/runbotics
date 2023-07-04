package com.runbotics.service.dto;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

public class ProcessAttendedUpdateDTO implements Serializable {

    @NotNull
    private Long id;

    @NotNull
    private Boolean isAttended;

    public ProcessAttendedUpdateDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getAttended() {
        return isAttended;
    }

    public void setAttended(Boolean attended) {
        isAttended = attended;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProcessAttendedUpdateDTO)) return false;
        ProcessAttendedUpdateDTO that = (ProcessAttendedUpdateDTO) o;
        return Objects.equals(id, that.id) && Objects.equals(isAttended, that.isAttended);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, isAttended);
    }

    @Override
    public String toString() {
        return "ProcessAttendedUpdateDTO{" +
            "id=" + id +
            ", isAttended=" + isAttended +
            '}';
    }
}
