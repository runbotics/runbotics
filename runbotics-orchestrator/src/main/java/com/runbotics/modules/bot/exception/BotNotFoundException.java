package com.runbotics.modules.bot.exception;

import com.runbotics.web.rest.errors.ErrorConstants;
import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class BotNotFoundException extends AbstractThrowableProblem {

    private static final long serialVersionUID = 1L;

    public BotNotFoundException() {
        super(ErrorConstants.BOT_NOT_FOUND_TYPE, "Bot not found", Status.NOT_FOUND);
    }

    public BotNotFoundException(Long botId) {
        super(ErrorConstants.BOT_NOT_FOUND_TYPE, "Bot " + botId + " not found", Status.NOT_FOUND);
    }

    public BotNotFoundException(String botId) {
        super(ErrorConstants.BOT_NOT_FOUND_TYPE, "Bot " + botId + " not found", Status.NOT_FOUND);
    }
}
