package com.analysisgg.modules.riotapi.adapter.in.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RiotVerificationController {

    private final String verificationCode;

    public RiotVerificationController(@Value("${riot.verification.code:}") String verificationCode) {
        this.verificationCode = verificationCode;
    }

    @GetMapping(value = "/riot.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    public String getRiotVerificationCode() {
        return verificationCode != null ? verificationCode : "";
    }
}
