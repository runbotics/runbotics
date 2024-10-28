package com.runbotics.web.rest.vm;

import com.runbotics.service.dto.AdminUserDTO;

import javax.validation.constraints.Size;
import java.util.UUID;

/**
 * View Model extending the AdminUserDTO, which is meant to be used in the user management UI.
 */
public class ManagedUserVM extends AdminUserDTO {

    public static final int PASSWORD_MIN_LENGTH = 4;

    public static final int PASSWORD_MAX_LENGTH = 100;

    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String password;

    private UUID inviteCode;

    public ManagedUserVM() {
        // Empty constructor needed for Jackson.
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UUID getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(UUID inviteCode) {
        this.inviteCode = inviteCode;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ManagedUserVM{" + super.toString() + ", inviteCode=" + inviteCode + "} ";
    }
}
