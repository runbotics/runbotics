package com.runbotics.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ActionMapperTest {

    private ActionMapper actionMapper;

    @BeforeEach
    public void setUp() {
        actionMapper = new ActionMapperImpl();
    }
}
