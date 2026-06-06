# Task Implementation Plan: Configure Maven Dependencies

## Status

Status: Ready for Implementation

Last updated: 2026-06-06

Plan file: `docs/features/riot-api-integration/task-plans/002-configure-maven-dependencies-plan.md`

## Task Reference

Task ID: `002-configure-maven-dependencies`

Task file: `docs/features/riot-api-integration/tasks/002-configure-maven-dependencies.md`

Task status: `Depends on Previous Task` (Prerequisite met)

## Feature Reference

Feature name: `riot-api-integration`

Feature file: `docs/features/riot-api-integration/feature.md`

Feature Tech Spec: `docs/features/riot-api-integration/tech-spec.md`

Technology definition: `docs/architecture/analysis-gg/technology-definition.md`

## Source Documents

| Source | Path or Reference | Relevant Section | Status | Notes |
| --- | --- | --- | --- | --- |
| Task file | `docs/features/riot-api-integration/tasks/002-configure-maven-dependencies.md` | Entire document | Confirmed by source document | Defines scope and acceptance criteria |
| Feature file | `docs/features/riot-api-integration/feature.md` | Entire document | Confirmed by source document | Functional context |
| Feature Tech Spec | `docs/features/riot-api-integration/tech-spec.md` | Confirmed Technology Decisions, Proposed Technical Approach | Confirmed by source document | Provides technical requirements and packaging info |
| Technology Definition | `docs/architecture/analysis-gg/technology-definition.md` | Confirmed Technology Decisions | Confirmed by source document | Core stack guidelines (Java 21, Maven, Spring Boot, Caffeine) |
| Spring Boot Reference | `docs/references/analysis-gg/technologies/springboot.md` | Usage Guidelines | Confirmed by source document | Port 8080 configuration, static resources packaging |
| Frontend Maven Plugin Reference | `docs/references/analysis-gg/technologies/frontend-maven-plugin.md` | Usage Guidelines, Examples | Confirmed by source document | Configuration example for local Node/NPM |
| Caffeine Reference | `docs/references/analysis-gg/technologies/caffeine.md` | Usage Guidelines | Confirmed by source document | Caching dependency context |

## Planning Scope

This plan covers task `002-configure-maven-dependencies` only, which involves setting up the Maven project configuration (`pom.xml`) and verifying the compilation and dependency trees. It does not authorize implementation or modification of any application source code.

## Task Summary

Create a root-level Maven `pom.xml` configuration that compiles the backend Spring Boot 3.3.x application with Java 21, imports Caffeine cache, Web, and Test starters (including WireMock), integrates the `frontend-maven-plugin` to build the embedded React frontend in `src/main/frontend/`, and ensures the local Java environment is fully validated.

## Execution Eligibility

Status: Eligible

Reason:
- The task depends on `001-prepare-feature-contract.md`.
- `001-prepare-feature-contract.md` has been successfully implemented and verified, as documented in `docs/STATE.md` (marked `Implemented`).
- Therefore, all prerequisites are met and this task is eligible for execution.

## Feature Context

To implement the Riot API Integration backend securely and efficiently, we need a standard, reproducible build environment. Configuring Maven at the root handles backend compiling, dependency importing, testing dependencies (WireMock), and orchestrating the React frontend build lifecycle through the `frontend-maven-plugin` so it can be packaged inside Spring Boot's jar file.

## Tech Spec Coverage

| Tech Spec Section | Coverage | Implemented by This Task | Gaps or Notes |
| --- | --- | --- | --- |
| Confirmed Technology Decisions | Full | Yes | Sets up Spring Boot, Maven, Caffeine Cache, Java 21, and React build integration |
| Proposed Technical Approach | Partial | Yes | Prepares the framework dependencies needed for caching and API client |
| Testing Strategy | Partial | Yes | Configures test scope dependencies (Spring Boot Starter Test, WireMock) |
| Performance Considerations | Partial | Yes | Prepares Caffeine Cache dependency for rate-limiting protection |

Coverage assessment:
- Justifying Tech Spec section: Confirmed Technology Decisions (table mapping stack to build tool, framework, caching, packaging)
- Tech Spec sections implemented by this task: Caching Library, Build System, Backend Framework, Build Plugin
- Gaps between task and Tech Spec: None. The task matches the Tech Spec build configuration needs.
- Dependencies not specified by the Tech Spec: None.

## Technology Decisions Used

| Decision | Source | Impact on This Task |
| --- | --- | --- |
| Java 21 | `technology-definition.md` | Configure `<java.version>21</java.version>` and set compiler release |
| Spring Boot (3.3.5) | `technology-definition.md` | Configure `spring-boot-starter-parent` as parent POM |
| Maven | `technology-definition.md` | Create `/pom.xml` in root folder |
| Caffeine Cache | `technology-definition.md` | Add `com.github.ben-manes.caffeine:caffeine` dependency |
| `frontend-maven-plugin` | `technology-definition.md` | Add and configure the plugin to build `src/main/frontend` |

## Applicable Guidelines

| Guideline | Path | Applies To | How It Affects This Plan |
| --- | --- | --- | --- |
| Java Coding Guidelines | `.agents/docs/architecture/coding-guidelines/README.md` | Project structure and backend packages | Guides package directory creation and Clean Architecture organization |

## Existing Decisions Reviewed

| Decision | Path | Relevance |
| --- | --- | --- |
| API Contracts & Serialization | `docs/features/riot-api-integration/decisions/contracts.md` | Jackson Object Mapper configuration needs | Jackson config (fail-on-unknown-properties) requires `spring-boot-starter-web` for dependency management |

## Local Codebase References

| Path or Area | What Was Checked | Relevance | Notes |
| --- | --- | --- | --- |
| `/` (Root directory) | Existing files | Check for existing build configurations | Validated that no `pom.xml` exists in root. Greenfield backend. |
| `/src/main/frontend` | Frontend directory structure | Check `package.json` location | Confirmed frontend is initialized and has `package.json`. |

## Confirmed Scope

- Create a parent `pom.xml` at the project root directory.
- Configure `spring-boot-starter-parent` (version `3.3.5`).
- Set `<properties>` for Java 21, UTF-8 encoding, and dependency versions.
- Configure dependencies:
  - `org.springframework.boot:spring-boot-starter-web` (REST APIs)
  - `org.springframework.boot:spring-boot-starter-cache` (Spring cache abstraction integration)
  - `com.github.ben-manes.caffeine:caffeine` (in-memory caching provider)
  - `org.springframework.boot:spring-boot-devtools` (optional runtime scope)
  - `org.springframework.boot:spring-boot-starter-test` (test scope)
  - `org.wiremock:wiremock-standalone` (version `3.6.0`, test scope)
- Configure plugins:
  - `org.springframework.boot:spring-boot-maven-plugin` (repackaging)
  - `com.github.eirslett:frontend-maven-plugin` (version `2.0.0`, configures local Node `v20.12.2` and npm `10.5.0` working on `src/main/frontend`)
- Setup standard Java directories:
  - `src/main/java/`
  - `src/test/java/`
- Verify that Maven compilation runs and dependency tree resolves successfully.

## Out of Scope

- Implementing Java controllers, client adapters, or caching configuration classes.
- Running frontend build manually or modifying React code files.

## Proposed Implementation Approach

1. Create a `pom.xml` file in the root workspace folder matching the dependencies, plugins, and properties specified in the Confirmed Scope.
2. Create standard folder paths:
   - `src/main/java/com/analysisgg`
   - `src/test/java/com/analysisgg`
3. Download/obtain a Maven wrapper (optional but highly recommended for developers without `mvn` globally mapped on Windows) or instruct the user to run Maven commands. Since `mvn` is not on the user's PATH, a Maven wrapper (`mvnw`) should be generated or added to ensure portability and run local builds.
4. Run `mvnw dependency:tree` (or through absolute path) to verify that all dependencies (Spring Web, Caffeine, Test, Wiremock) resolve correctly.
5. Run `mvnw clean compile` to check that compilation succeeds.

## Expected Files or Areas

| Expected File or Area | Expected Action | Confidence | Source | Notes |
| --- | --- | --- | --- | --- |
| `/pom.xml` | Create | Confirmed | Task file | Root Maven configuration |
| `src/main/java/com/analysisgg` | Create | Confirmed | Tech spec | Backend base package directory |
| `src/test/java/com/analysisgg` | Create | Confirmed | Task file | Test source directory |

## Implementation Steps

1. Create `/pom.xml` at the root directory with Spring Boot 3.3.5, Java 21, Caffeine cache, WireMock, and `frontend-maven-plugin` configurations.
2. Initialize directories `src/main/java/com/analysisgg` and `src/test/java/com/analysisgg`.
3. Add Maven wrapper files (`.mvn/wrapper/maven-wrapper.properties`, `mvnw`, `mvnw.cmd`) at the root using standard Maven wrapper files (Maven version `3.9.6`).
4. Execute `mvnw clean compile` using PowerShell to compile the project and download all dependencies.
5. Execute `mvnw dependency:tree` to confirm correct versions of Web, Caffeine, and WireMock are resolved.

## Acceptance Criteria Mapping

| Acceptance Criterion | Planned Coverage | Validation Evidence |
| --- | --- | --- |
| A valid `pom.xml` exists in the root directory. | Will be created with all necessary configurations | Inspection of `/pom.xml` |
| Maven build compiles (`mvn clean compile` succeeds). | Execute `./mvnw clean compile` | Command output showing `BUILD SUCCESS` |
| Caffeine Cache library is included. | Add Caffeine to dependencies list | `mvnw dependency:tree` output showing Caffeine dependency |
| Spring Boot Web starter library is included. | Add `spring-boot-starter-web` | `mvnw dependency:tree` output showing `spring-boot-starter-web` |
| WireMock standalone or Spring runner library is included under `test` scope. | Add `wiremock-standalone` (v3.6.0) under `test` scope | `mvnw dependency:tree` output showing `wiremock-standalone` |

## Tests and Validation Strategy

| Test or Validation | Type | Purpose | Notes |
| --- | --- | --- | --- |
| `mvnw clean compile` | Manual / Verification | Ensures compilation succeeds and all maven wrapper paths are correct | Run in project root |
| `mvnw dependency:tree` | Manual / Verification | Inspect dependencies to ensure Caffeine, Spring Web, and WireMock are pulled correctly | Check log output |
| Directory structure verification | Manual / Verification | Ensures `src/main/java` and `src/test/java` are created | Visual check |

## Dependencies

- Previous task: `001-prepare-feature-contract.md` (Completed).
- External: Access to Maven Central repository to fetch dependencies and local Node/npm installers.

## Risks and Edge Cases

- **No global Maven path**: Local PowerShell has no global `mvn` binary. *Mitigation*: We will configure and use the Maven Wrapper (`mvnw`), which is best practice for Java projects.
- **Node/NPM execution policy error**: Global `npm` has an execution policy issue in PowerShell. *Mitigation*: The `frontend-maven-plugin` downloads and executes Node/NPM in an isolated local `target/` directory, which is independent of global PATH and PowerShell script execution restrictions.
- **Java version mismatch**: Ensure the local environment runs Java 21. *Mitigation*: We ran `java -version` and verified it is `21.0.11`.

## Rollback or Recovery Notes

- If dependencies fail to download or configurations corrupt, delete the root `/pom.xml` and target folders, and revert to greenfield state.

## Pending Decisions

None. All task-relevant decisions have been answered or explicitly deferred out of scope by the user.

## Questions for the User

None. All task-relevant questions have been answered.

## Decisions Created During Planning

No local feature/task decisions were created during this planning session.

## Task Planning Readiness Checklist

- [x] Task file reviewed.
- [x] Feature context reviewed.
- [x] Feature Tech Spec coverage verified.
- [x] Technology decisions reviewed.
- [x] Applicable guidelines reviewed.
- [x] Existing decisions reviewed.
- [x] Local codebase references checked when applicable.
- [x] Task dependencies checked.
- [x] Execution eligibility documented.
- [x] Blocking decisions resolved.
- [x] Local feature/task decisions documented when needed.
- [x] Architecture/global decisions routed to ADR or `resolve-architecture-blocker` when needed.
- [x] Implementation approach defined.
- [x] Acceptance criteria mapped.
- [x] Tests and validation strategy defined.
- [x] Risks and rollback notes documented.

## Notes for Execute Task

- Ensure `mvnw.cmd` has correct line endings (CRLF) for execution on Windows.
- Double-check that no Maven caching issues block downloading dependencies.
- Make sure that when the build runs, the `frontend-maven-plugin` starts Node/NPM download correctly into `target/`.
