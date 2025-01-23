package com.runbotics.service;

import com.runbotics.domain.Guest;
import com.runbotics.domain.User;
import com.runbotics.service.dto.ProcessDTO;

import java.util.Optional;

public interface GuestService {
    boolean verifyGuestLimit(String guestIp);

    User generateGuestAccount(String guestIp, String langKey);

    void deleteAllGuestAccounts();
}
