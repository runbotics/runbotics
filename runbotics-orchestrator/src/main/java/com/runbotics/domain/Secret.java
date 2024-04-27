package com.runbotics.domain;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import javax.crypto.Cipher;

/**
 * A Tag.
 */
@Entity
@Table(name = "secret")
public class Secret implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(nullable = false)
    private String name;

    public Secret id(Long id) {
        this.id = id;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Secret)) {
            return false;
        }
        return id != null && id.equals(((Secret) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Secret{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ",}";
    }
}
