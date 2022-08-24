package com.runbotics.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GlobalVariableMapperTest {

    private GlobalVariableMapper globalVariableMapper;

    @BeforeEach
    public void setUp() {
        globalVariableMapper = new GlobalVariableMapperImpl();
    }
}
