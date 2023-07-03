package com.runbotics.service;

import com.runbotics.domain.User;

public interface GuestService {
    boolean verifyGuest(String guestIp);

    User generateGuestAccount(String guestIp, String langKey);

    void deleteAllGuestAccounts();
}
