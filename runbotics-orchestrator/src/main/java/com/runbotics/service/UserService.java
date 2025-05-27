package com.runbotics.service;

import com.runbotics.config.Constants;
import com.runbotics.domain.*;
import com.runbotics.repository.*;
import com.runbotics.security.AuthoritiesConstants;
import com.runbotics.security.SecurityUtils;
import com.runbotics.service.criteria.UserCriteria;
import com.runbotics.service.dto.AccountPartialUpdateDTO;
import com.runbotics.service.dto.AdminUserDTO;
import com.runbotics.service.dto.UserDTO;
import com.runbotics.service.mapper.AccountPartialUpdateMapper;
import com.runbotics.service.mapper.AdminUserMapper;
import com.runbotics.service.mapper.UserMapper;
import com.runbotics.utils.Utils;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.security.RandomUtil;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    private final ProcessRepository processRepository;

    private final UserMapper userMapper;

    private final TenantInviteCodeRepository tenantInviteCodeRepository;

    private final TenantRepository tenantRepository;

    private final AccountPartialUpdateMapper accountPartialUpdateMapper;

    private final AdminUserMapper adminUserMapper;

    private static final String ENTITY_NAME = "user";

    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthorityRepository authorityRepository,
        ProcessRepository processRepository,
        TenantInviteCodeRepository tenantInviteCodeRepository,
        TenantRepository tenantRepository,
        UserMapper userMapper,
        AccountPartialUpdateMapper accountPartialUpdateMapper,
        AdminUserMapper adminUserMapper
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
        this.processRepository = processRepository;
        this.tenantInviteCodeRepository = tenantInviteCodeRepository;
        this.tenantRepository = tenantRepository;
        this.userMapper = userMapper;
        this.accountPartialUpdateMapper = accountPartialUpdateMapper;
        this.adminUserMapper = adminUserMapper;
    }

    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        return userRepository
            .findOneByActivationKey(key)
            .map(
                user -> {
                    // activate given user for the registration key.
                    user.setActivated(true);
                    user.setActivationKey(null);
                    log.debug("Activated user: {}", user);
                    return user;
                }
            );
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);
        return userRepository
            .findOneByResetKey(key)
            .filter(user -> user.getResetDate().isAfter(Instant.now().minusSeconds(86400)))
            .map(
                user -> {
                    user.setPassword(passwordEncoder.encode(newPassword));
                    user.setResetKey(null);
                    user.setResetDate(null);
                    return user;
                }
            );
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository
            .findOneByEmailIgnoreCase(mail)
            .filter(User::isActivated)
            .map(
                user -> {
                    user.setResetKey(RandomUtil.generateResetKey());
                    user.setResetDate(Instant.now());
                    return user;
                }
            );
    }

    @Transactional(noRollbackFor = BadRequestAlertException.class)
    public User registerUser(AdminUserDTO userDTO, String password, UUID inviteCodeId) {
        userRepository
            .findOneByEmail(userDTO.getEmail())
            .ifPresent(
                existingUser -> {
                    throw new UsernameAlreadyUsedException();
                }
            );
        userRepository
            .findOneByEmailIgnoreCase(userDTO.getEmail())
            .ifPresent(
                existingUser -> {
                    throw new EmailAlreadyUsedException();
                }
            );
        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setEmail(userDTO.getEmail().toLowerCase());
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(userDTO.getFirstName());
        newUser.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            newUser.setEmail(userDTO.getEmail().toLowerCase());
        }
        newUser.setImageUrl(userDTO.getImageUrl());
        newUser.setLangKey(userDTO.getLangKey());
        // new user is not active
        newUser.setActivated(false);
        // new user gets registration key
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findById(AuthoritiesConstants.USER).ifPresent(authorities::add);
        newUser.setAuthorities(authorities);

        if (inviteCodeId != null) {
            TenantInviteCode tenantInviteCode = tenantInviteCodeRepository
                .findById(inviteCodeId)
                .orElseThrow(() -> new BadRequestAlertException("Bad invite code", ENTITY_NAME, "badInviteCode"));

            if (tenantInviteCode.getExpirationDate().isBefore(ZonedDateTime.now())) {
                log.debug("Removed expired invite codes for tenant with id: {}", tenantInviteCode.getTenantId());
                tenantInviteCodeRepository.delete(tenantInviteCode);
                throw new BadRequestAlertException("Invite code has expired", ENTITY_NAME, "expiredInviteCode");
            }

            Tenant foundTenant = tenantRepository
                .findByInviteCode(inviteCodeId).get();

            newUser.setTenant(foundTenant);
        } else {
            newUser.setTenant(Utils.getDefaultTenant());
        }

        userRepository.save(newUser);
        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }

    private boolean removeNonActivatedUser(User existingUser) {
        if (existingUser.isActivated()) {
            return false;
        }
        userRepository.delete(existingUser);
        userRepository.flush();
        return true;
    }

    public User createUser(AdminUserDTO userDTO) {
        User user = new User();
        user.setEmail(userDTO.getEmail().toLowerCase());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail().toLowerCase());
        }
        user.setImageUrl(userDTO.getImageUrl());
        if (userDTO.getLangKey() == null) {
            user.setLangKey(Constants.DEFAULT_LANGUAGE); // default language
        } else {
            user.setLangKey(userDTO.getLangKey());
        }
        String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());
        user.setActivated(true);
        if (userDTO.getRoles() != null) {
            Set<Authority> authorities = userDTO
                .getRoles()
                .stream()
                .map(authorityRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
            user.setAuthorities(authorities);
        }

        // Temporary solution for keeping tenant id not null
        user.setTenant(Utils.getDefaultTenant());

        userRepository.save(user);
        log.debug("Created Information for User: {}", user);
        return user;
    }

    /**
     * Update all information for a specific user, and return the modified user.
     *
     * @param userDTO user to update.
     * @return updated user.
     */
    public Optional<AdminUserDTO> updateUser(AdminUserDTO userDTO) {
        return Optional
            .of(userRepository.findById(userDTO.getId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(
                user -> {
                    user.setEmail(userDTO.getEmail().toLowerCase());
                    user.setFirstName(userDTO.getFirstName());
                    user.setLastName(userDTO.getLastName());
                    if (userDTO.getEmail() != null) {
                        user.setEmail(userDTO.getEmail().toLowerCase());
                    }
                    user.setImageUrl(userDTO.getImageUrl());
                    user.setActivated(userDTO.isActivated());
                    user.setLangKey(userDTO.getLangKey());
                    Set<Authority> managedAuthorities = user.getAuthorities();
                    managedAuthorities.clear();
                    userDTO
                        .getRoles()
                        .stream()
                        .map(authorityRepository::findById)
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .forEach(managedAuthorities::add);
                    log.debug("Changed Information for User: {}", user);
                    return user;
                }
            )
            .map(AdminUserDTO::new);
    }

    public void deleteUser(Long id) {
        userRepository
            .findOneById(id)
            .ifPresent(
                user -> {
                    userRepository.delete(user);
                    log.debug("Deleted User: {}", user);
                }
            );

        if (processRepository.countUserProcesses(id) > 0) {
            processRepository.deleteUnassignedPrivateProcesses();
        }
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Update basic information (first name, last name, email, language) for the current user.
     *
     * @param firstName first name of user.
     * @param lastName  last name of user.
     * @param email     email id of user.
     * @param langKey   language key.
     * @param imageUrl  image URL of user.
     */
    public void updateUser(String firstName, String lastName, String email, String langKey, String imageUrl) {
        SecurityUtils
            .getCurrentUserEmail()
            .flatMap(userRepository::findOneByEmail)
            .ifPresent(
                user -> {
                    user.setFirstName(firstName);
                    user.setLastName(lastName);
                    if (email != null) {
                        user.setEmail(email.toLowerCase());
                    }
                    user.setLangKey(langKey);
                    user.setImageUrl(imageUrl);
                    log.debug("Changed Information for User: {}", user);
                }
            );
    }

    /**
     * Update information for the current user.
     *
     * @param userDTO includes only fields available for the user to update
     */
    public void partialAccountUpdate(User user, AccountPartialUpdateDTO userDTO) {
        accountPartialUpdateMapper.partialUpdate(user, userDTO);

        userRepository.save(user);
        log.debug("User information updated", user);
    }

    /**
     * Partial update information for the current user.
     * @param adminUserDTO additionally ignoring fields:
     *                     imageUrl, createBy, createdDate,
     *                     lastModifiedBy, lastModifiedDate,
     *                     featureKeys
     * @return updated user
     */
    public Optional<AdminUserDTO> partialUpdate(AdminUserDTO adminUserDTO) {
        log.debug("Request to partially update User : {}", adminUserDTO);

        User requester = getUserWithAuthorities().get();
        if(!adminUserDTO.isActivated() && Objects.equals(requester.getId(), adminUserDTO.getId())) {
            throw new BadRequestAlertException("User cannot deactivate itself", ENTITY_NAME, "SelfDeactivate");
        }

        excludeAdminUserDTOFields(adminUserDTO);
        return userRepository
            .findById(adminUserDTO.getId())
            .map(
                existingUser -> {
                    userRepository
                        .findOtherUserByEmail(adminUserDTO.getId(), adminUserDTO.getEmail())
                        .ifPresent(
                            user -> {
                                if (user.getEmail().equals(adminUserDTO.getEmail())) {
                                    throw new BadRequestAlertException("Email already in use", ENTITY_NAME, "AlreadyUsedEmail");
                                } else {
                                    throw new BadRequestAlertException("Login already in use", ENTITY_NAME, "AlreadyUsedLogin");
                                }
                            }
                        );

                    if (adminUserDTO.getTenant() != null) {
                        Tenant newTenant = tenantRepository.findById(adminUserDTO.getTenant().getId()).orElseThrow(
                            () -> new BadRequestAlertException("Tenant not found", ENTITY_NAME, "TenantNotFound")
                        );
                        adminUserDTO.setTenant(null);
                        adminUserMapper.partialUpdate(existingUser, adminUserDTO);
                        existingUser.setTenant(newTenant);
                    } else {
                        adminUserMapper.partialUpdate(existingUser, adminUserDTO);
                    }

                    if (adminUserDTO.getRoles() != null) {
                        Set<Authority> managedAuthorities = existingUser.getAuthorities();
                        managedAuthorities.clear();
                        adminUserDTO
                            .getRoles()
                            .stream()
                            .map(authorityRepository::findById)
                            .filter(Optional::isPresent)
                            .map(Optional::get)
                            .forEach(managedAuthorities::add);
                    }

                    return existingUser;
                }
            )
            .map(userRepository::save)
            .map(userMapper::userToAdminUserDTO);
    }

    public Optional<AdminUserDTO> partialUpdateInTenant(AdminUserDTO adminUserDTO) {
        User requester = getUserWithAuthorities().get();

        if(!adminUserDTO.isActivated() && Objects.equals(requester.getId(), adminUserDTO.getId())) {
            throw new BadRequestAlertException("User cannot deactivate itself", ENTITY_NAME, "SelfDeactivate");
        }

        adminUserDTO.setTenant(null);
        excludeAdminUserDTOFields(adminUserDTO);
        return userRepository
            .findById(adminUserDTO.getId())
            .map(
                existingUser -> {
                    if (!requester.getTenant().getId().equals(existingUser.getTenant().getId())) {
                        throw new BadRequestAlertException("Edited user is not from the same tenant", ENTITY_NAME, "NotValidTenant");
                    }

                    userRepository
                        .findOtherUserByEmail(adminUserDTO.getId(), adminUserDTO.getEmail())
                        .ifPresent(
                            user -> {
                                if (user.getEmail().equals(adminUserDTO.getEmail())) {
                                    throw new BadRequestAlertException("Email already in use", ENTITY_NAME, "AlreadyUsedEmail");
                                } else {
                                    throw new BadRequestAlertException("Login already in use", ENTITY_NAME, "AlreadyUsedLogin");
                                }
                            }
                        );

                    adminUserMapper.partialUpdate(existingUser, adminUserDTO);

                    if (adminUserDTO.getRoles() != null) {
                        if (!checkTenantAllowedRoles(adminUserDTO.getRoles())) {
                            throw new BadRequestAlertException("Not allowed role", ENTITY_NAME, "NotAllowedRole");
                        }

                        Set<Authority> managedAuthorities = existingUser.getAuthorities();
                        managedAuthorities.clear();
                        adminUserDTO
                            .getRoles()
                            .stream()
                            .map(authorityRepository::findById)
                            .filter(Optional::isPresent)
                            .map(Optional::get)
                            .forEach(managedAuthorities::add);
                    }

                    return existingUser;
                }
            )
            .map(userRepository::save)
            .map(userMapper::userToAdminUserDTO);
    }

    @Transactional
    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils
            .getCurrentUserEmail()
            .flatMap(userRepository::findOneByEmail)
            .ifPresent(
                user -> {
                    String currentEncryptedPassword = user.getPassword();
                    if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                        throw new InvalidPasswordException();
                    }
                    String encryptedPassword = passwordEncoder.encode(newPassword);
                    user.setPassword(encryptedPassword);
                    log.debug("Changed password for User: {}", user);
                }
            );
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(AdminUserDTO::new);
    }

    @Transactional(readOnly = true)
    public List<User> getNonAdminUsers() {
        return userRepository.findAllActivatedNonAdmins();
    }

    @Transactional(readOnly = true)
    public List<AdminUserDTO> getAllManagedUsersLimited() {
        return userRepository.findAll().stream().map(User::getEmail).map(AdminUserDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllPublicUsers(Pageable pageable) {
        return userRepository.findAllByIdNotNullAndActivatedIsTrue(pageable).map(UserDTO::new);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByEmail(String email) {
        return userRepository.findOneWithAuthoritiesByEmail(email);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities() {
        return SecurityUtils.getCurrentUserEmail().flatMap(userRepository::findOneWithAuthoritiesByEmail);
    }

    @Transactional(readOnly = true)
    public boolean isUserActivated() {
        return this.getUserWithAuthorities().get().isActivated();
    }

    @Transactional(readOnly = true)
    public List<String> findUserFeatureKeys() {
        User user = this.getUserWithAuthorities().orElseGet(User::new);

        return user
            .getAuthorities()
            .stream()
            .map(Authority::getFeatureKeys)
            .flatMap(Set::stream)
            .map(FeatureKey::getName)
            .distinct()
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllNotActivatedUsers(Pageable pageable, UserCriteria criteria) {
        if (criteria.getTenantId() == null && criteria.getEmail() == null) {
            return userRepository.findAllByActivatedIsFalse(pageable).map(AdminUserDTO::new);
        }

        if (criteria.getTenantId() == null && criteria.getEmail() != null) {
            return userRepository
                .findAllByActivatedIsFalseAndEmailIsContaining(pageable, criteria.getEmail().getContains())
                .map(AdminUserDTO::new);
        }

        Tenant tenant = tenantRepository.findById(criteria.getTenantId().getEquals()).orElseThrow(
            () -> new BadRequestAlertException("Cannot find tenant", ENTITY_NAME, "tenantNotFound")
        );

        return fetchAllNotActivatedUsersByTenant(pageable, criteria, tenant);
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllActivatedUsers(Pageable pageable, UserCriteria criteria) {
        if (criteria.getTenantId() == null && criteria.getEmail() == null) {
            return userRepository.findAllByActivatedIsTrue(pageable).map(AdminUserDTO::new);
        }
        if (criteria.getTenantId() == null && criteria.getEmail() != null) {
            return userRepository
                .findAllByActivatedIsTrueAndEmailIsContaining(pageable, criteria.getEmail().getContains())
                .map(AdminUserDTO::new);
        }

        Tenant tenant = tenantRepository.findById(criteria.getTenantId().getEquals()).orElseThrow(
            () -> new BadRequestAlertException("Cannot find tenant", ENTITY_NAME, "tenantNotFound")
        );

        return fetchAllActivatedUsersByTenant(pageable, criteria, tenant);
    }

    public Page<AdminUserDTO> getAllActivatedUsersByTenant(Pageable pageable, UserCriteria criteria) {
        Tenant tenant = getUserWithAuthorities().get().getTenant();
        return fetchAllActivatedUsersByTenant(pageable, criteria, tenant);
    }

    public Page<AdminUserDTO> getAllNotActivatedUsersByTenant(Pageable pageable, UserCriteria criteria) {
        Tenant tenant = getUserWithAuthorities().get().getTenant();
        return fetchAllNotActivatedUsersByTenant(pageable, criteria, tenant);
    }

    /**
     * Not activated users should be automatically deleted after 3 days.
     * <p>
     * This is scheduled to get fired everyday, at 01:00 (am).
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void removeNotActivatedUsers() {
        userRepository
        .findAllByHasBeenActivatedIsFalseAndCreatedDateBefore(Instant.now().minus(3, ChronoUnit.DAYS))
        .forEach(
            user -> {
                log.debug("Removing not activated user: {}", user.getEmail());
                userRepository.delete(user);
            }
        );
    }

    /**
     * Gets a list of all the authorities.
     *
     * @return a list of all the authorities.
     */
    @Transactional(readOnly = true)
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Long> findAllGuestIds() {
        return authorityRepository
            .findAll()
            .stream()
            .filter(authority -> authority.getName().equals(AuthoritiesConstants.GUEST))
            .flatMap(guest -> guest.getUsers().stream().map(User::getId))
            .collect(Collectors.toList());
    }

    public boolean hasAdminRole(User user) {
        var adminAuthority = new Authority();
        adminAuthority.setName(AuthoritiesConstants.ADMIN);

        return user.getAuthorities().contains(adminAuthority);
    }

    private void excludeAdminUserDTOFields(AdminUserDTO adminUserDTO) {
        if (adminUserDTO.getImageUrl() != null) {
            throw new BadRequestAlertException("Not allowed field", ENTITY_NAME, "imageUrl");
        }

        if (adminUserDTO.getCreatedBy() != null) {
            throw new BadRequestAlertException("Not allowed field", ENTITY_NAME, "createdBy");
        }

        if (adminUserDTO.getCreatedDate() != null) {
            throw new BadRequestAlertException("Not allowed field", ENTITY_NAME, "createdDate");
        }

        if (adminUserDTO.getLastModifiedBy() != null) {
            throw new BadRequestAlertException("Not allowed field", ENTITY_NAME, "lastModifiedBy");
        }

        if (adminUserDTO.getLastModifiedDate() != null) {
            throw new BadRequestAlertException("Not allowed field", ENTITY_NAME, "lastModifiedDate");
        }

        if (adminUserDTO.getFeatureKeys() != null) {
            throw new BadRequestAlertException("Not allowed field", ENTITY_NAME, "featureKeys");
        }
    }

    private boolean checkTenantAllowedRoles(Set<String> userRoles) {
        Set<String> allowedRoles = new HashSet<>();
        allowedRoles.add(AuthoritiesConstants.USER);
        allowedRoles.add(AuthoritiesConstants.EXTERNAL_USER);
        allowedRoles.add(AuthoritiesConstants.TENANT_ADMIN);

        return userRoles.stream().allMatch(allowedRoles::contains);
    }

    private Page<AdminUserDTO> fetchAllNotActivatedUsersByTenant(Pageable pageable, UserCriteria criteria, Tenant tenant) {
        if (criteria.getEmail() == null) {
            return userRepository
                .findAllByActivatedIsFalseAndTenant(pageable, tenant)
                .map(AdminUserDTO::new);
        }

        return userRepository
            .findAllByActivatedIsFalseAndEmailIsContainingAndTenant(
                pageable, criteria.getEmail().getContains(), tenant
            ).map(AdminUserDTO::new);
    }

    private Page<AdminUserDTO> fetchAllActivatedUsersByTenant(Pageable pageable, UserCriteria criteria, Tenant tenant) {
        if (criteria.getEmail() == null) {
            return userRepository
                .findAllByActivatedIsTrueAndTenant(pageable, tenant)
                .map(AdminUserDTO::new);
        }

        return userRepository
            .findAllByActivatedIsTrueAndEmailIsContainingAndTenant(
                pageable, criteria.getEmail().getContains(), tenant
            ).map(AdminUserDTO::new);
    }
}
