package com.runbotics.web.rest.vm;

import com.runbotics.service.dto.AdminUserDTO;
import java.util.UUID;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * View Model extending the AdminUserDTO, which is meant to be used in the user management UI.
 */
public class ManagedUserVM extends AdminUserDTO {

    public static final int PASSWORD_MIN_LENGTH = 14;
    public static final int PASSWORD_MAX_LENGTH = 100;

    private static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])$";

    @Size(
        min = PASSWORD_MIN_LENGTH,
        max = PASSWORD_MAX_LENGTH,
        message = "Incorrect password. Must include at least 14 characters upper and lower cased, special character and digit"
    )
    @Pattern(
        regexp = PASSWORD_REGEX,
        message = "Incorrect password. Must include at least 14 characters upper and lower cased, special character and digit"
    )
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
