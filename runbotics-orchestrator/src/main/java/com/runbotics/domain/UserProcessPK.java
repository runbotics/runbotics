package com.runbotics.domain;

import java.io.Serializable;

import javax.persistence.*;

@Embeddable
public class UserProcessPK implements Serializable {

    @Column(name = "user_id")
    Long userId;

    @Column(name = "process_id")
    Long processId;

    public UserProcessPK() {
    }

    public UserProcessPK(Long userId, Long processId) {
        this.userId = userId;
        this.processId = processId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProcessId() {
        return processId;
    }

    public void setProcessId(Long processId) {
        this.processId = processId;
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserProcessPK)) {
            return false;
        }
        return (userId != null && userId.equals(((UserProcessPK) o).userId)) &&
            (processId != null && processId.equals(((UserProcessPK) o).processId));
    }
}
