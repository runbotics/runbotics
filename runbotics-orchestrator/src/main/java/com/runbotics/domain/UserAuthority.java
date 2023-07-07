package com.runbotics.domain;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "jhi_user_authority")
@IdClass(UserAuthorityId.class)
public class UserAuthority {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Id
    @Column(name = "authority_name")
    private String authorityName;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
