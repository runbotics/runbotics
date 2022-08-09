package com.runbotics.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Lob;

/**
 * A DTO for the {@link com.runbotics.domain.Action} entity.
 */
public class ActionDTO implements Serializable {

    private String id;

    private String label;

    private String script;

    @Lob
    private String form;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getScript() {
        return script;
    }

    public void setScript(String script) {
        this.script = script;
    }

    public String getForm() {
        return form;
    }

    public void setForm(String form) {
        this.form = form;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActionDTO)) {
            return false;
        }

        ActionDTO actionDTO = (ActionDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, actionDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActionDTO{" +
            "id='" + getId() + "'" +
            ", label='" + getLabel() + "'" +
            ", script='" + getScript() + "'" +
            ", form='" + getForm() + "'" +
            "}";
    }
}
