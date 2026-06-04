# Technology Reference: Frontend Maven Plugin

## Status

Status: Captured

Last updated: 2026-06-04

Captured by: Antigravity

## Technology Decision Reference

Related technology definition: [technology-definition.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/architecture/analysis-gg/technology-definition.md)

Decision area: Build & Integration Plugin (Backend/Frontend Packaging)

Decision status: Confirmed by user (implied by selection of Maven and integrated React setup)

## Why This Technology Was Selected

The `frontend-maven-plugin` is standard for Java projects containing an embedded frontend:
- Automatically downloads and installs a local node and npm binary in the `target/` folder, removing the requirement of having Node.js pre-installed on the host build machine.
- Seamlessly hooks `npm install` and `npm run build` executions into the Maven build lifecycle (e.g., during the resource generation phase).
- Ensures that every `mvn clean package` build automatically compiles a fresh production-ready frontend bundle and copies it directly into Spring Boot's static resources output folder.

## Official Documentation Sources

| Source | URL or Context7 Library ID | Notes |
| --- | --- | --- |
| Context7 | /eirslett/frontend-maven-plugin | Context7 library ID resolved successfully |
| GitHub Repository | https://github.com/eirslett/frontend-maven-plugin | Official plugin repository |

## Context7 Notes

The working directory should be set to the location of the React codebase (e.g. `src/main/frontend`). The download versions of Node.js and npm can be configured globally or inside the installation execution block.

## Relevant Concepts for This Project

- **workingDirectory**: Set to `src/main/frontend` to locate the `package.json` file.
- **install-node-and-npm**: Generates local Node/npm runtimes in the target/ directory.
- **npm execution**: Runs arbitrary scripts (like `install` or `run build`) during specified Maven lifecycle phases.

## Usage Guidelines for This Project

- Configure the plugin inside the `<build><plugins>` block of `pom.xml` in the root folder.
- Set `<workingDirectory>src/main/frontend</workingDirectory>` and `<installDirectory>target</installDirectory>`.
- Configure `nodeVersion` to a stable LTS version (e.g. `v20.x.x` or `v22.x.x`).
- Bind `npm install` to the `initialize` or `generate-resources` phase.
- Bind `npm run build` (which runs Vite compilation) to the `process-resources` or `prepare-package` phase.
- Ensure the React build output directory (configured in `vite.config.ts`) is set to build into the maven class output path (e.g. `../resources/static` or using maven-resources-plugin to copy from `dist` to `target/classes/static`).

## Examples or Patterns to Follow

```xml
<plugin>
    <groupId>com.github.eirslett</groupId>
    <artifactId>frontend-maven-plugin</artifactId>
    <version>2.0.0</version>
    <configuration>
        <workingDirectory>src/main/frontend</workingDirectory>
        <installDirectory>target</installDirectory>
    </configuration>
    <executions>
        <!-- 1. Install Node & npm locally -->
        <execution>
            <id>install-node-and-npm</id>
            <goals>
                <goal>install-node-and-npm</goal>
            </goals>
            <phase>initialize</phase>
            <configuration>
                <nodeVersion>v20.12.2</nodeVersion>
                <npmVersion>10.5.0</npmVersion>
            </configuration>
        </execution>
        <!-- 2. Run npm install -->
        <execution>
            <id>npm-install</id>
            <goals>
                <goal>npm</goal>
            </goals>
            <phase>generate-resources</phase>
            <configuration>
                <arguments>install</arguments>
            </configuration>
        </execution>
        <!-- 3. Run npm run build (compiles Vite) -->
        <execution>
            <id>npm-build</id>
            <goals>
                <goal>npm</goal>
            </goals>
            <phase>compile</phase>
            <configuration>
                <arguments>run build</arguments>
            </configuration>
        </execution>
    </executions>
</plugin>
```

## Risks or Caveats

- **Build Performance**: Installing Node/npm and running `npm install` on every clean build can slow down build times. Cache directories (`node_modules`) can be preserved locally to speed up incremental builds.
- **Node Version Drift**: Ensure that the local developer's globally installed node version is close to the one configured in `pom.xml` to avoid type/package build errors.

## Related Harness Documents

| Document | Path | Relationship |
| --- | --- | --- |
| Technology Definition | [technology-definition.md](file:///c:/Users/lucas.dourado/IdeaProjects/analysis-gg/docs/architecture/analysis-gg/technology-definition.md) | Source decision |
