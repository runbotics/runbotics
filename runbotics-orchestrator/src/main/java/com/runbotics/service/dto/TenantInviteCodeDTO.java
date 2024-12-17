package com.runbotics.service.dto;

import com.runbotics.domain.TenantInviteCode;

import java.util.UUID;

public class TenantInviteCodeDTO {

    private UUID inviteCode;

    public TenantInviteCodeDTO(TenantInviteCode tenantInviteCode) {
        this.inviteCode = tenantInviteCode.getId();
    }

    public UUID getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(UUID inviteCode) {
        this.inviteCode = inviteCode;
    }
}
