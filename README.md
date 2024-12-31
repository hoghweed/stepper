# Stepper 🚀 <!-- omit in toc -->

Stepper is a demo project that implements a microservices orchestration flow using the Routing Slip Pattern. It showcases reliable messaging, data persistence, and service orchestration with Moleculer, all built with modern tools like TypeScript and Turborepo. The project is designed for learning and experimentation with key concepts in distributed systems.

- [Features ✨](#features-)
- [Requirements 🛠️](#requirements-️)
- [Architecture 🏗️](#architecture-️)
- [Implementation Details 🧩](#implementation-details-)
- [Repo Structure 📂](#repo-structure-)
- [Docker Compose Setup 🐳](#docker-compose-setup-)
  - [Starting the Environment](#starting-the-environment)
- [Disclaimers ⚠️](#disclaimers-️)
- [Getting Started 🏁](#getting-started-)


## Features ✨

- Microservices Orchestration: Implements the Routing Slip pattern for dynamic workflows.
- Reliable Messaging: Uses NATS JetStream for robust message delivery.
- Data Persistence: Persists data in CouchDB using Moleculer DB and a CouchDB adapter.
- Environment Validation: Uses Zod for robust environment configuration validation.
- Monorepo Management: Managed with Turborepo and pnpm workspaces.

## Requirements 🛠️

To run the project, ensure the following tools are installed:

- pnpm: A fast, disk-space-efficient package manager. Install pnpm.
- Turborepo: A high-performance build system for monorepos. Install Turborepo.

You can install both running:

```bash
brew install pnpm
pnpm install turbo --global
```

## Architecture 🏗️

The Stepper project leverages the following technologies and concepts:

1. **Moleculer Framework**:
   - A modern microservices framework in TypeScript.
   - Moleculer Channels: Ensures reliable messaging with NATS JetStream.
   - Moleculer DB: Simplifies data access with the CouchDB adapter.
2. **NATS JetStream**:
   - Provides messaging infrastructure for reliable and durable communication.
3. **CouchDB**:
   - A NoSQL document database for storing routing slips and logs.
4. **Zod**:
   - Ensures environment variables are validated at runtime, preventing configuration errors.
5. **Turborepo**:
   - Streamlines development workflows and repository scripts.

## Implementation Details 🧩

Stepper Orchestration Flow

The Stepper implements a basic workflow for microservices orchestration using the Routing Slip Pattern. This pattern enables dynamic routing of messages through multiple services, with each step performing a specific action.

Core Components

1. Activity Service:
   - Responsible for executing activities in the workflow.
   - Manages compensations for potential failures (logic for this is not implemented in this demo).
2. Routing Slip:
   - Defines the sequence of steps, conditions, and compensations for the workflow.

## Repo Structure 📂

The project is a pnpm workspace with the following structure:

```bash
stepper/
├── apps/
│   ├── stepper/        # Main application implementing the Routing Slip logic
│   ├── docs/           # Vitepress application for project documentation
├── dev/                # Folder for Docker container data storage
├── turbo.json          # Turborepo configuration file
└── docker-compose.yml  # Docker Compose setup for development environment
```

## Docker Compose Setup 🐳

The development environment is containerized with Docker Compose:

Services:

1. NATS JetStream:
   - Provides reliable messaging and stream processing.
   - Enabled for persistence and advanced message handling.
2. CouchDB:
   - Acts as the document database to persist routing slip states and logs.

Data Storage

- A ```dev/``` folder in the root directory is mounted into the containers for physical data storage, ensuring persistence across container restarts.

### Starting the Environment

Run the following command to start the development environment:

```bash
pnpm bootstrap
```

## Disclaimers ⚠️

- Compensation Logic:
  - The project does not implement compensation logic. This is a demo to illustrate the concept of microservices orchestration.

## Getting Started 🏁

Follow these steps to run the project locally:

```bash

# step 1 - clone the repo
git clone https://github.com/yourusername/stepper.git
cd stepper

# step 2 - bootstrap the repo
#  2.1 - install packages
#  2.2 - build the project
#  2.3 - start the compose containers  
pnpm bootstrap

```
