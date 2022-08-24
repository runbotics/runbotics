package com.runbotics.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.runbotics.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BotTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bot.class);
        Bot bot1 = new Bot();
        bot1.setId(1L);
        Bot bot2 = new Bot();
        bot2.setId(bot1.getId());
        assertThat(bot1).isEqualTo(bot2);
        bot2.setId(2L);
        assertThat(bot1).isNotEqualTo(bot2);
        bot1.setId(null);
        assertThat(bot1).isNotEqualTo(bot2);
    }
}
