package com.analysisgg.modules.riotapi.domain.exception;

public class PlayerNotFoundException extends RiotApiException {
    public PlayerNotFoundException(String message) {
        super(message);
    }

    public PlayerNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
