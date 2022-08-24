package com.runbotics.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Type;

/**
 * A Action.
 */
@Entity
@Table(name = "action")
public class Action implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Column(name = "label")
    private String label;

    @Column(name = "script")
    private String script;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "form")
    private String form;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Action id(String id) {
        this.id = id;
        return this;
    }

    public String getLabel() {
        return this.label;
    }

    public Action label(String label) {
        this.label = label;
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getScript() {
        return this.script;
    }

    public Action script(String script) {
        this.script = script;
        return this;
    }

    public void setScript(String script) {
        this.script = script;
    }

    public String getForm() {
        return this.form;
    }

    public Action form(String form) {
        this.form = form;
        return this;
    }

    public void setForm(String form) {
        this.form = form;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Action)) {
            return false;
        }
        return id != null && id.equals(((Action) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Action{" +
            "id=" + getId() +
            ", label='" + getLabel() + "'" +
            ", script='" + getScript() + "'" +
            ", form='" + getForm() + "'" +
            "}";
    }
}
