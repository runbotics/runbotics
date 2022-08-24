package com.runbotics.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class BotMapperTest {

    private BotMapper botMapper;

    @BeforeEach
    public void setUp() {
        botMapper = new BotMapperImpl();
    }
}
