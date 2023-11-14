package com.runbotics.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "notification_type")
public class NotificationType implements Serializable {

    @NotNull
    @Size(max = 50)
    @Id
    @Column(length = 50)
    public String type;

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
        NotificationType that = (NotificationType) o;
        return Objects.equals(type, that.type);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type);
    }

    @Override
    public String toString() {
        return "NotificationType{" +
            "type='" + type + '\'' +
            '}';
    }

    public enum NotificationTypeName {
        PROCESS("PROCESS_ERROR"),
        BOT("BOT_DISCONNECTED");

        private final String type;

        NotificationTypeName(String type) {
            this.type = type;
        }

        public String value() {
            return this.type;
        }
    }
}
