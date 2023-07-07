package com.runbotics.domain;

import javax.persistence.Embeddable;
import java.io.Serializable;


@Embeddable
public class UserAuthorityId implements Serializable {
    private Long userId;
    private String authorityName;
}
