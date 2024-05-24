package com.runbotics.web.rest;

import com.runbotics.config.Constants;
import com.runbotics.domain.User;
import com.runbotics.repository.UserRepository;
import com.runbotics.security.AuthoritiesConstants;
import com.runbotics.security.FeatureKeyConstants;
import com.runbotics.service.MailService;
import com.runbotics.service.UserQueryService;
import com.runbotics.service.UserService;
import com.runbotics.service.criteria.UserCriteria;
import com.runbotics.service.dto.AdminUserDTO;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import com.runbotics.web.rest.errors.EmailAlreadyUsedException;
import com.runbotics.web.rest.errors.LoginAlreadyUsedException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.Collections;
import java.util.stream.Collectors;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing users.
 * <p>
 * This class accesses the {@link User} entity, and needs to fetch its collection of authorities.
 * <p>
 * For a normal use-case, it would be better to have an eager relationship between User and Authority,
 * and send everything to the client side: there would be no View Model and DTO, a lot less code, and an outer-join
 * which would be good for performance.
 * <p>
 * We use a View Model and a DTO for 3 reasons:
 * <ul>
 * <li>We want to keep a lazy association between the user and the authorities, because people will
 * quite often do relationships with the user, and we don't want them to get the authorities all
 * the time for nothing (for performance reasons). This is the #1 goal: we should not impact our users'
 * application because of this use-case.</li>
 * <li> Not having an outer join causes n+1 requests to the database. This is not a real issue as
 * we have by default a second-level cache. This means on the first HTTP call we do the n+1 requests,
 * but then all authorities come from the cache, so in fact it's much better than doing an outer join
 * (which will get lots of data from the database, for each HTTP call).</li>
 * <li> As this manages users, for security reasons, we'd rather have a DTO layer.</li>
 * </ul>
 * <p>
 * Another option would be to have a specific JPA entity graph to handle this case.
 */
@RestController
@RequestMapping("/api/admin")
public class UserResource {

    private static final List<String> ALLOWED_ORDERED_PROPERTIES = Collections.unmodifiableList(
        Arrays.asList("id", "login", "firstName", "lastName", "email", "activated", "langKey")
    );

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    private static final String ENTITY_NAME = "user";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserService userService;

    private final UserQueryService userQueryService;

    private final UserRepository userRepository;

    private final MailService mailService;

    public UserResource(
        UserService userService,
        UserQueryService userQueryService,
        UserRepository userRepository,
        MailService mailService
    ) {
        this.userService = userService;
        this.userQueryService = userQueryService;
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    /**
     * {@code POST  /admin/users}  : Creates a new user.
     * <p>
     * Creates a new user if the login and email are not already used, and sends an
     * mail with an activation link.
     * The user needs to be activated on creation.
     *
     * @param userDTO the user to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new user, or with status {@code 400 (Bad Request)} if the login or email is already in use.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the login or email is already in use.
     */
    @PostMapping("/users")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<User> createUser(@Valid @RequestBody AdminUserDTO userDTO) throws URISyntaxException {
        log.debug("REST request to save User : {}", userDTO);

        if (userDTO.getId() != null) {
            throw new BadRequestAlertException("A new user cannot already have an ID", "userManagement", "idexists");
            // Lowercase the user login before comparing with database
        } else if (userRepository.findOneByLogin(userDTO.getLogin().toLowerCase()).isPresent()) {
            throw new LoginAlreadyUsedException();
        } else if (userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException();
        } else {
            User newUser = userService.createUser(userDTO);
            mailService.sendCreationEmail(newUser);
            return ResponseEntity
                .created(new URI("/api/admin/users/" + newUser.getLogin()))
                .headers(HeaderUtil.createAlert(applicationName, "userManagement.created", newUser.getLogin()))
                .body(newUser);
        }
    }

    /**
     * {@code PUT /admin/users} : Updates an existing User.
     *
     * @param userDTO the user to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated user.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already in use.
     * @throws LoginAlreadyUsedException {@code 400 (Bad Request)} if the login is already in use.
     */
    @PutMapping("/users")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<AdminUserDTO> updateUser(@Valid @RequestBody AdminUserDTO userDTO) {
        log.debug("REST request to update User : {}", userDTO);
        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
            throw new EmailAlreadyUsedException();
        }
        existingUser = userRepository.findOneByLogin(userDTO.getLogin().toLowerCase());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
            throw new LoginAlreadyUsedException();
        }
        Optional<AdminUserDTO> updatedUser = userService.updateUser(userDTO);

        return ResponseUtil.wrapOrNotFound(
            updatedUser,
            HeaderUtil.createAlert(applicationName, "userManagement.updated", userDTO.getLogin())
        );
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BASIC_USER_READ + "')")
    @GetMapping("/users/limited")
    public ResponseEntity<List<AdminUserDTO>> getUsersLimited() {
        log.debug("REST request to get logins of all users");
        final List<AdminUserDTO> users = userService.getAllManagedUsersLimited();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    /**
     * {@code PATCH /admin/users} : Partial updates given fields of an existing user, field will ignore if it is null
     * @param id the id of the globalVariableDTO to save.
     * @param adminUserDTO the User to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    @PatchMapping("/users/{id}")
    public ResponseEntity<AdminUserDTO> partialUpdate(
        @PathVariable(value = "id", required = true) Long id,
        @NotNull @RequestBody AdminUserDTO adminUserDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update User partially : {}, {}", id, adminUserDTO);

        Optional<AdminUserDTO> result = userService.partialUpdate(adminUserDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, adminUserDTO.getId().toString())
        );
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.TENANT_EDIT_USER + "')")
    @PatchMapping("/users/tenant/{id}")
    public ResponseEntity<AdminUserDTO> partialUpdateInTenant(
        @PathVariable(value = "id", required = true) Long id,
        @NotNull @RequestBody AdminUserDTO adminUserDTO
    ) {
        log.debug("REST request to partial update User in tenant partially : {}, {}", id, adminUserDTO);

        Optional<AdminUserDTO> result = userService.partialUpdateInTenant(adminUserDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, adminUserDTO.getId().toString())
        );
    }

    /**
     * {@code GET /admin/users} : get all users with all the details - calling this are only allowed for the administrators.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users.
     */
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getAllUsers(Pageable pageable) {
        log.debug("REST request to get all User for an admin");
        if (!onlyContainsAllowedProperties(pageable)) {
            return ResponseEntity.badRequest().build();
        }

        final Page<AdminUserDTO> page = userService.getAllManagedUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * {@code GET /admin/users/non-admins} : get all non-admin users. Only basic information
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users.
     */
    @GetMapping("/users/non-admins")
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BASIC_USER_READ + "')")
    public ResponseEntity<List<User>> getNonAdminUsers() {
        log.debug("REST request to get all non-admin users");

        List<User> nonAdminUsers = userService.getNonAdminUsers()
            .stream().map(user -> {
                User limitedUser = new User();
                limitedUser.setId(user.getId());
                limitedUser.setLogin(user.getLogin());
                limitedUser.setEmail(user.getEmail());
                return limitedUser;
            })
            .collect(Collectors.toList());

        return new ResponseEntity<>(nonAdminUsers, HttpStatus.OK);
    }

    private boolean onlyContainsAllowedProperties(Pageable pageable) {
        return pageable.getSort().stream().map(Sort.Order::getProperty).allMatch(ALLOWED_ORDERED_PROPERTIES::contains);
    }

    /**
     * {@code GET /admin/users/:login} : get the "login" user.
     *
     * @param login the login of the user to find.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the "login" user, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/users/{login}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<AdminUserDTO> getUser(@PathVariable @Pattern(regexp = Constants.LOGIN_REGEX) String login) {
        log.debug("REST request to get User : {}", login);
        return ResponseUtil.wrapOrNotFound(userService.getUserWithAuthoritiesByLogin(login).map(AdminUserDTO::new));
    }

    /**
     * {@code GET /admin/users/not-activated} : get all not activated users with all the details - calling this are only allowed for the administrators.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users.
     */
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    @GetMapping("/users/not-activated")
    public ResponseEntity<Page<AdminUserDTO>> getAllNotActivatedUsers(UserCriteria criteria, Pageable pageable) {
        log.debug("REST request to get all not activated User : {}, by criteria: {}", pageable, criteria);
        if (!onlyContainsAllowedProperties(pageable)) {
            return ResponseEntity.badRequest().build();
        }

        Page<AdminUserDTO> page = userService.getAllNotActivatedUsers(pageable, criteria);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page, headers, HttpStatus.OK);
    }

    /**
     * {@code GET /admin/users/activated} : get all activated users with all the details - calling this are only allowed for the administrators.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users.
     */
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    @GetMapping("/users/activated")
    public ResponseEntity<Page<AdminUserDTO>> getAllActivatedUsers(UserCriteria criteria, Pageable pageable) {
        log.debug("REST request to get all activated User: {}, by criteria: {}", pageable, criteria);
        if (!onlyContainsAllowedProperties(pageable)) {
            return ResponseEntity.badRequest().build();
        }

        Page<AdminUserDTO> page = userService.getAllActivatedUsers(pageable, criteria);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page, headers, HttpStatus.OK);
    }

    /**
     * {@code GET /admin/users/activated-tenant} : get all activated users by tenant with all the details
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users in tenant.
     */
    @GetMapping("/users/not-activated-tenant")
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.TENANT_EDIT_USER + "')")
    public ResponseEntity<Page<AdminUserDTO>> getAllNotActivatedUsersByTenant(UserCriteria criteria, Pageable pageable) {
        log.debug("REST request to get all by tenant activated User: {}, by criteria: {}", pageable, criteria);
        if (!onlyContainsAllowedProperties(pageable)) {
            return ResponseEntity.badRequest().build();
        }

        Page<AdminUserDTO> page = userService.getAllNotActivatedUsersByTenant(pageable, criteria);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page, headers, HttpStatus.OK);
    }

    /**
     * {@code GET /admin/users/not-activated-tenant} : get all not activated users by tenant with all the details
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users in tenant.
     */
    @GetMapping("/users/activated-tenant")
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.TENANT_EDIT_USER + "')")
    public ResponseEntity<Page<AdminUserDTO>> getAllActivatedUsersByTenant(UserCriteria criteria, Pageable pageable) {
        log.debug("REST request to get all by tenant activated User: {}, by criteria: {}", pageable, criteria);
        if (!onlyContainsAllowedProperties(pageable)) {
            return ResponseEntity.badRequest().build();
        }

        Page<AdminUserDTO> page = userService.getAllActivatedUsersByTenant(pageable, criteria);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page, headers, HttpStatus.OK);
    }

    /**
     * {@code DELETE /admin/users/:id} : delete the User based on id.
     *
     * @param id the id of the user to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.debug("REST request to delete User: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createAlert(applicationName, "userManagement.deleted", id.toString())).build();
    }
}
