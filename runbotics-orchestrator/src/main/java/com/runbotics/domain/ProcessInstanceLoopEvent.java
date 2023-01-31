package com.runbotics.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A ProcessInstanceEvent.
 */
@Entity
@Table(name = "process_instance_loop_event")
public class ProcessInstanceLoopEvent extends ProcessInstanceEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "iteration")
    private Integer iteration;

    public Integer getIteration() {
        return iteration;
    }

    public void setIteration(Integer iteration) {
        this.iteration = iteration;
    }
    @Override
    public String toString() {
        return "ProcessInstanceLoopEvent{" +
            "id=" + getId() +
            ", created='" + getCreated() + "'" +
            ", log='" + getLog() + "'" +
            ", step='" + getStep() + "'" +
            ", executionId='" + getExecutionId() + "'" +
            ", iteration='" + getIteration() + "'" +
            ", input='" + getInput() + "'" +
            ", output='" + getOutput() + "'" +
            ", finished='" + getFinished() + "'" +
            ", status='" + getStatus() + "'" +
            ", error='" + getError() + "'" +
            "}";
    }
}
