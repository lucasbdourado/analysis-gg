package com.analysisgg.modules.riotapi.domain.exception;

public class RateLimitExceededException extends RiotApiException {
    public RateLimitExceededException(String message) {
        super(message);
    }

    public RateLimitExceededException(String message, Throwable cause) {
        super(message, cause);
    }
}
