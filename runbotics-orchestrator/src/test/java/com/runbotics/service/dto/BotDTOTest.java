package com.runbotics.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BotDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(BotDTO.class);
        BotDTO botDTO1 = new BotDTO();
        botDTO1.setId(1L);
        BotDTO botDTO2 = new BotDTO();
        assertThat(botDTO1).isNotEqualTo(botDTO2);
        botDTO2.setId(botDTO1.getId());
        assertThat(botDTO1).isEqualTo(botDTO2);
        botDTO2.setId(2L);
        assertThat(botDTO1).isNotEqualTo(botDTO2);
        botDTO1.setId(null);
        assertThat(botDTO1).isNotEqualTo(botDTO2);
    }
}
