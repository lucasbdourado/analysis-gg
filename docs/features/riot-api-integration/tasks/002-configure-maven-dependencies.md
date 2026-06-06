# Task: Configure Maven Dependencies

## Status

Implemented

## Task ID

002-configure-maven-dependencies

## Feature

`docs/features/riot-api-integration/feature.md`

## Source Documents

- `docs/features/riot-api-integration/feature.md`
- `docs/features/riot-api-integration/tech-spec.md`
- `docs/architecture/analysis-gg/technology-definition.md`

## Goal

Initialize the root Maven `pom.xml` configuration for the Spring Boot application, including Web, Caching (Caffeine), and Testing dependencies.

## Context

The backend has no codebase yet (it is greenfield). We need to create a parent `pom.xml` in the root directory that configures Spring Boot 3.x, Java 21, and all required libraries needed for REST APIs, caching, concurrent execution, and wiremock-based integration tests.

## Scope

- Create a Maven `pom.xml` at the root directory (`/pom.xml`).
- Add Spring Boot Starter Web and DevTools.
- Add Caffeine Cache dependency (`com.github.ben-manes.caffeine:caffeine`).
- Add testing dependencies: `spring-boot-starter-test`, Mockito, and WireMock (`org.wiremock:wiremock-standalone` or spring equivalent).
- Configure Java 21 compiler version and UTF-8 encoding.
- Ensure maven wrapper/directories (`src/main/java`, `src/test/java`) are structured.

## Out of Scope

- Implementing Java classes, RestControllers, or caching adapters.

## Depends On

- `001-prepare-feature-contract.md`

## Blocking Reason

None

## Required Action

None

## Acceptance Criteria

- [x] A valid `pom.xml` exists in the root directory.
- [x] Maven build compiles (`mvn clean compile` succeeds).
- [x] Caffeine Cache library is included.
- [x] Spring Boot Web starter library is included.
- [x] WireMock standalone or Spring runner library is included under `test` scope.

## Implementation Notes

- Use standard Spring Boot 3.3.x parent POM or latest stable version.
- Align dependency versions with the `docs/architecture/analysis-gg/technology-definition.md` guidelines.
- Enable virtual threads by setting compiler release to 21.

## Validation Notes

- Run `mvn dependency:tree` and verify the presence of `spring-boot-starter-web`, `caffeine`, and `wiremock`.
- Ensure `mvn clean compile` finishes with `BUILD SUCCESS`.

## Risks

- Compiler version mismatch if local JDK is not version 21. Confirm local Java environment in plan.

## Open Questions

- None

## Notes for Plan Task

- Make sure to check the local Maven installation and java version during task planning.
