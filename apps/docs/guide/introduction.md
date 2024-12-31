---
outline: deep
---

# Introduction to Stepper

Stepper is a demo project that implements a microservices orchestration flow using the Routing Slip Pattern. It showcases reliable messaging, data persistence, and service orchestration with Moleculer, all built with modern tools like TypeScript and Turborepo. The project is designed for learning and experimentation with key concepts in distributed systems.


Stepper is built with:

| Technology                       | Purpose                    |
| -------------------------------- | -------------------------- |
| **TypeScript**                   |                            |
| **Moleculer Framework**          | for microservices          |
| **Moleculer Channels**           | for reliable microservices |
| **Moleculer DB**                 | for integrated data access |
| **Moleculer DB CouchDB Adapter** | for couchdb integration    |
| **NATS JetStream**               | for reliable messaging     |
| **CouchDB**                      | for persistance            |
| **Turborepo**                    | for repository management  |


## Repo structure

The solution is hosted as a **pnpm monorepo (workspace)** considering two applications:

1. **docs** - the documentation application (the one you're looking at now)
2. **stepper** - the sample application implementation

```bash
stepper/
├── apps/
│   ├── stepper/        # Main application implementing the Routing Slip logic
│   ├── docs/           # Vitepress application for project documentation
├── dev/                # Folder for Docker container data storage
├── turbo.json          # Turborepo configuration file
└── docker-compose.yml  # Docker Compose setup for development environment
```

Been a pnpm monorepo (workspace) the solution has the following important areas to consider

### Root scripts

| Script             | Intent                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------- |
| `preinstall`       | Ensures that `pnpm` is the only allowed package manager for the project.                |
| `build`            | Executes a monorepo build using `turbo`.                                                |
| `bootstrap`        | Installs dependencies for the project using `pnpm`.                                     |
| `postbootstrap`    | Runs the `build` script and starts the service layer dependencies using Docker Compose. |
| `check`            | Performs a code quality check using `biome`.                                            |
| `clean`            | Runs both `clean:outputs` and `clean:artifacts` scripts to clean the project.           |
| `clean:artifacts`  | Removes coverage, `dist`, and `node_modules` folders across the project.                |
| `clean:outputs`    | Cleans outputs generated by `turbo`.                                                    |
| `clean:datastore`  | Deletes the local datastore used in development.                                        |
| `clean:all`        | Runs `clean` and `clean:datastore` scripts in parallel.                                 |
| `commit`           | Prompts for a structured commit message using `git-cz` and Commitizen.                  |
| `dev`              | Starts the development environment with parallelized builds using `turbo`.              |
| `format`           | Checks code formatting using `turbo`.                                                   |
| `format:fix`       | Fixes code formatting issues.                                                           |
| `lint`             | Lints the project using `turbo`.                                                        |
| `lint:fix`         | Automatically fixes linting issues.                                                     |
| `typecheck`        | Performs TypeScript type checking across the monorepo.                                  |
| `prepare`          | Installs Git hooks using `husky`.                                                       |
| `run:sl:full`      | Starts all service layer dependencies defined in Docker Compose.                        |
| `run:sl:full:stop` | Stops all running service layer dependencies started by Docker Compose.                 |

### Stepper scripts (app level)

| Script      | Intent                                                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `prebuild`  | Runs the linter (`pnpm lint`) and cleans up the `dist` directory before building.                                             |
| `build`     | Compiles the TypeScript code using the `tsconfig.json` configuration file.                                                    |
| `clean`     | Removes the `.turbo` folder and `node_modules` to clean the project environment.                                              |
| `dev`       | Runs both the development server (`dev:start`) and the TypeScript type checker (`typecheck`) in parallel.                     |
| `dev:start` | Starts the server in watch mode using `tsx`, with the Node.js inspector enabled and environment variables loaded from `.env`. |
| `lint`      | Lints the source code in the `./src` folder using `biome lint`.                                                               |
| `format`    | Formats the source code in the `./src` folder using `biome format`.                                                           |
| `start`     | Runs the built server (`dist/server.js`) with source maps enabled and environment variables loaded from `.env`.               |
| `typecheck` | Performs a TypeScript type check without emitting any output files.                                                           |

### Docs scripts (app level)

| Script         | Intent                                                                          |
| -------------- | ------------------------------------------------------------------------------- |
| `test`         | Placeholder script that outputs an error message and exits with a failure code. |
| `docs:dev`     | Starts the development server for the VitePress documentation site.             |
| `docs:build`   | Builds the VitePress documentation site for production.                         |
| `docs:preview` | Previews the production build of the VitePress documentation site.              |

## Docker Compose structure

The Docker Compose configuration sets up three primary services to support the **Stepper** application: a **NATS JetStream** server for messaging, a **CouchDB** database for data storage, and a **dependency checker** to ensure the required services are running before starting the application. Persistent data storage and essential configurations are included for each service.

### Services Overview

| Service            | Intent                                                       | Ports                      | Address                |
|---------------------|-------------------------------------------------------------|----------------------------|------------------------|
| `stp-nats`         | NATS server with JetStream enabled for messaging and data streaming. | 4222 (client), 8222 (monitoring), 6222 (clustering) | `localhost:4222`, `localhost:8222`, `localhost:6222` |
| `stp-db`           | CouchDB database for storing application data with admin credentials. | 5984                      | `localhost:5984`      |
| `stp_dependencies` | Waits for `stp-nats` and `stp-db` services to be available before proceeding. | N/A                       | Internal to Docker network |

### Detailed Description

- **`stp-nats`:**  
  - Runs a **NATS JetStream** server, which provides a high-performance messaging and streaming solution.
  - Ports:
    - `4222`: NATS client communication.
    - `8222`: Monitoring and management interface.
    - `6222`: Cluster communication.
  - Persistent JetStream data is stored in `./dev/.datastore/stp-nats/data`.

- **`stp-db`:**  
  - Runs a **CouchDB** instance for document-based data storage.
  - Port `5984` is exposed for database interactions.
  - Admin credentials (`COUCHDB_USER` and `COUCHDB_PASSWORD`) are set to `admin` and `admin123`, respectively.
  - Persistent data is stored in `./dev/.datastore/stp-db`.

- **`stp_dependencies`:**  
  - Uses a lightweight dependency checker image to ensure `stp-nats` and `stp-db` are fully operational before the application continues.
  - No exposed ports; runs internal checks within the Docker network.

This setup ensures smooth initialization and a robust infrastructure for the Stepper application.