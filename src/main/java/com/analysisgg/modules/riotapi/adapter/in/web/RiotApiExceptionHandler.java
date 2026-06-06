package com.analysisgg.modules.riotapi.adapter.in.web;

import com.analysisgg.modules.riotapi.domain.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;

@RestControllerAdvice(assignableTypes = RiotApiController.class)
public class RiotApiExceptionHandler {

    @ExceptionHandler({InvalidRiotIdException.class, UnsupportedRegionException.class})
    public ResponseEntity<ErrorResponse> handleBadRequest(RuntimeException ex) {
        ErrorResponse error = new ErrorResponse("Bad Request", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParams(MissingServletRequestParameterException ex) {
        ErrorResponse error = new ErrorResponse("Bad Request", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(PlayerNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(PlayerNotFoundException ex) {
        ErrorResponse error = new ErrorResponse("Not Found", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ErrorResponse> handleRateLimit(RateLimitExceededException ex) {
        ErrorResponse error = new ErrorResponse("Too Many Requests", ex.getMessage());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(error);
    }

    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<ErrorResponse> handleTimeout(ResourceAccessException ex) {
        ErrorResponse error = new ErrorResponse("Gateway Timeout", "The connection to Riot API timed out.");
        return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT).body(error);
    }

    @ExceptionHandler(RiotApiException.class)
    public ResponseEntity<ErrorResponse> handleRiotApi(RiotApiException ex) {
        String msg = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";
        boolean isTimeout = msg.contains("timeout") || msg.contains("timed out") || msg.contains("time out");
        if (isTimeout) {
            ErrorResponse error = new ErrorResponse("Gateway Timeout", ex.getMessage());
            return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT).body(error);
        }
        ErrorResponse error = new ErrorResponse("Internal Server Error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        ErrorResponse error = new ErrorResponse("Internal Server Error", "An unexpected error occurred.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
