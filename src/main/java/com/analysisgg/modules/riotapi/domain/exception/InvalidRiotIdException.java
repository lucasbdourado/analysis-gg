package com.analysisgg.modules.riotapi.domain.exception;

public class InvalidRiotIdException extends RuntimeException {
    public InvalidRiotIdException(String message) {
        super(message);
    }
}
