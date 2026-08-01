# MeggeMe

Personal website featuring game-inspired pages.

## Features

Each section has a unique aesthetic inspired by different games and media:

- **Home** - Persona 3 inspired menu
- **About Me** - Milk Outside a Bag of Milk Outside a Bag of Milk
- **Blog** - Needy Streamer Overload style blog page
- **Photos** - Wii Menu inspired photo gallery
- **Links** - Minecraft 3D panorama with social links
- **Guestbook** - Persona 5 themed interactive guestbook with avatar selection

## Development

Install dependencies:

```bash
npm install
```

Start all development servers:

```bash
npm start
```

Start individual sections:

```bash
npm run start:blog    # Blog only
npm run start:photos  # Photos only
```

Build for production:

```bash
npm run build           # Build all sections
npm run build:blog      # Blog only
npm run build:photos    # Photos only
```

Clean build artifacts:

```bash
npm run clean
```

### Linting

Linting is configured for both the JavaScript frontend (ESLint) and Go backend (`golangci-lint`):

```bash
npm run lint           # Run all linters (JS + Go)
npm run lint:js        # Lint JavaScript files (ESLint)
npm run lint:fix       # Automatically fix JS linting issues
npm run lint:go        # Lint Go backend (golangci-lint)
```

### Using Docker

Build and run with Docker Compose:

```bash
docker compose up -d --build
```

Stop the containers:

```bash
docker compose down
```

## Deployment

Self-hosted on a Raspberry Pi. Docker Compose runs two services: a nginx container serving static files and proxying all `/api/` requests to the Go backend, which persists data to `/home/pi/data` on the host.
