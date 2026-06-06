package com.analysisgg.modules.riotapi.domain.valueobject;

import com.analysisgg.modules.riotapi.domain.exception.InvalidRiotIdException;
import java.util.regex.Pattern;

public record RiotId(String gameName, String tagLine) {
    private static final Pattern GAME_NAME_PATTERN = Pattern.compile("^[a-zA-Z0-9\\s_.-]{3,16}$");
    private static final Pattern TAG_LINE_PATTERN = Pattern.compile("^[a-zA-Z0-9]{3,5}$");

    public RiotId {
        if (gameName == null || !GAME_NAME_PATTERN.matcher(gameName).matches()) {
            throw new InvalidRiotIdException("Invalid game name. Must be 3-16 characters and contain only alphanumeric, space, underscore, dot, or hyphen characters.");
        }
        if (tagLine == null || !TAG_LINE_PATTERN.matcher(tagLine).matches()) {
            throw new InvalidRiotIdException("Invalid tagline. Must be 3-5 alphanumeric characters.");
        }
    }

    public static RiotId parse(String riotIdStr) {
        if (riotIdStr == null) {
            throw new InvalidRiotIdException("Riot ID string cannot be null.");
        }
        int hashIndex = riotIdStr.indexOf('#');
        if (hashIndex == -1 || hashIndex != riotIdStr.lastIndexOf('#')) {
            throw new InvalidRiotIdException("Riot ID must contain exactly one '#' character.");
        }
        String name = riotIdStr.substring(0, hashIndex);
        String tag = riotIdStr.substring(hashIndex + 1);
        return new RiotId(name, tag);
    }

    @Override
    public String toString() {
        return gameName + "#" + tagLine;
    }
}
