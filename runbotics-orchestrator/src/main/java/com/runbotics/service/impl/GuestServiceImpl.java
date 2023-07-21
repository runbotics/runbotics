package com.runbotics.service.impl;

import com.runbotics.domain.Authority;
import com.runbotics.domain.Guest;
import com.runbotics.domain.User;
import com.runbotics.repository.GuestRepository;
import com.runbotics.security.AuthoritiesConstants;
import com.runbotics.service.GuestService;
import com.runbotics.service.ProcessService;
import com.runbotics.service.UserService;
import com.runbotics.service.dto.ProcessDTO;
import com.runbotics.service.exception.GuestProcessInternalServerError;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.security.RandomUtil;

import java.util.*;

@Service
public class GuestServiceImpl implements GuestService {
    private final UserService userService;
    private final GuestRepository guestRepository;
    private final ProcessService processService;
    private final PasswordEncoder passwordEncoder;


    public GuestServiceImpl(
        UserService userService,
        GuestRepository guestRepository,
        ProcessService processService,
        PasswordEncoder passwordEncoder
    ) {
        this.userService = userService;
        this.guestRepository = guestRepository;
        this.processService = processService;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean verifyGuestLimit(String guestIp) {
        Optional<Guest> guestOptional = guestRepository.findById(guestIp);
        return guestOptional.isEmpty();
    }

    @Transactional
    public User generateGuestAccount(String guestIp, String langKey) {
        User guestUser = userService.saveUser(createGuestUser(langKey));
        guestRepository.save(createGuest(guestIp, guestUser));
        return guestUser;
    }

    @Override
    public ProcessDTO getGuestDemoProcess() {
        User guest = this.userService.getUserWithAuthorities().get();

        List<ProcessDTO> processes = this.processService.findUserProcesses(guest);

        if (processes.size() > 1) {
            throw new GuestProcessInternalServerError();
        }

        return processes.get(0);
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteAllGuestAccounts() {
        guestRepository.deleteAllGuest();
    }

    public Optional<Guest> findGuestById(Long id) {
        var guestOptional = guestRepository.findGuestById(id);
        return guestOptional;
    }

    private Guest createGuest(String guestIp, User user) {
        var guest = new Guest();
        guest.setIp(guestIp);
        guest.setExecutionsCount(0);
        guest.setUser(user);
        return guest;
    }

    private User createGuestUser(String langKey) {
        User guestUser = new User();

        var name = String.format("Guest-%s", UUID.randomUUID().toString().substring(0, 20));
        guestUser.setLogin(name);
        guestUser.setEmail(String.format("%s@runbotics.com", name.toLowerCase()));
        String encryptedPassword = passwordEncoder.encode(UUID.randomUUID().toString());
        guestUser.setPassword(encryptedPassword);
        guestUser.setActivated(true);
        guestUser.setLangKey(langKey);
        guestUser.setCreatedBy("system");
        guestUser.setActivationKey(RandomUtil.generateActivationKey());

        Set<Authority> authorities = new HashSet<>();
        var authority = new Authority();
        authority.setName(AuthoritiesConstants.GUEST);
        authorities.add(authority);
        guestUser.setAuthorities(authorities);

        return guestUser;
    }
}
