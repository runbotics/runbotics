package com.runbotics.domain;

import com.fasterxml.jackson.annotation.JsonView;
import com.runbotics.service.dto.ProcessDTOViews;
import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "bot_system")
public class BotSystem {

    @NotNull
    @Size(max = 50)
    @Id
    @Column(length = 50)
    @JsonView(ProcessDTOViews.DefaultView.class)
    public String name;

    public BotSystem() {}

    public BotSystem(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BotSystem botSystem = (BotSystem) o;
        return Objects.equals(name, botSystem.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "BotSystem{" + "name='" + name + '\'' + '}';
    }

    public enum BotSystemName {
        WINDOWS("WINDOWS"),
        LINUX("LINUX"),
        ANY("ANY");

        private final String name;

        BotSystemName(String name) {
            this.name = name;
        }

        public String value() {
            return this.name;
        }
    }
}
