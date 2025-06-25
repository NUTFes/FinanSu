# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development Workflow
```bash
# Setup and basic development
make run-db          # Start database containers (MySQL + MinIO)
make build          # Build application containers
make run            # Start application containers
make run-all        # Start everything (DB + App + Swagger)

# Alternative direct Docker commands
docker compose -f compose.db.yml up -d
docker compose build
docker compose up
```

### Code Generation (Critical)
```bash
make gen            # Generate both API and frontend code from OpenAPI spec
make gen-api        # Generate Go server code from OpenAPI
make gen-front-api  # Generate TypeScript hooks from OpenAPI
```

### Testing and Quality
```bash
make run-test       # Run Go API tests
make run-eslint     # Run frontend linting
make format         # Format frontend code with Prettier
```

### Other Useful Commands
```bash
make run-sb         # Run Storybook for component development
make ent-db         # Enter MySQL database shell
make run-swagger    # Start Swagger UI documentation
```

## Architecture Overview

**FinanSu** is a financial management system built with:
- **Backend**: Go + Echo framework + GORM + MySQL
- **Frontend**: Next.js 14 + TypeScript + Chakra UI + Recoil
- **Storage**: MinIO (S3-compatible)
- **Code Generation**: OpenAPI-driven development

### Project Structure
```
/api/               # Go backend (Clean Architecture)
  ├── main.go       # Entry point
  ├── drivers/      # Infrastructure (DB, MinIO, server)
  ├── externals/    # Controllers & repositories
  ├── internals/    # Domain & use cases
  └── generated/    # Auto-generated OpenAPI code

/view/next-project/ # Next.js frontend
  ├── src/components/   # React components by feature
  ├── src/pages/        # Next.js file-based routing
  ├── src/generated/    # Auto-generated API hooks
  └── src/store/        # Recoil state management

/openapi/           # OpenAPI specification (source of truth)
/mysql/db/          # Database schema and migrations
```

## Key Development Patterns

### Code Generation Workflow
1. Edit `/openapi/openapi.yaml` for API changes
2. Run `make gen` to regenerate Go server code and TypeScript hooks
3. Implement server-side logic in controllers and use cases
4. Use generated hooks in React components for type-safe API calls

### Clean Architecture (Backend)
- **Controllers**: Handle HTTP requests/responses (`/api/externals/controller/`)
- **Use Cases**: Business logic (`/api/internals/usecase/`)
- **Repositories**: Data access (`/api/externals/repository/`)
- **Domain**: Business entities (`/api/internals/domain/`)

### Frontend Organization
- Components organized by feature/domain
- Global state with Recoil + persistence
- SWR for data fetching with generated hooks
- Chakra UI + Tailwind CSS for styling

## Database & Data Management

### Database Access
```bash
make ent-db  # Access MySQL shell
```

### File Storage
- MinIO handles file uploads (receipts, documents)
- Files referenced in database, stored in object storage
- PDF generation and CSV exports for reporting

## Testing Strategy

### Backend Testing
```bash
make run-test  # Run Go tests with database fixtures
```

### Frontend Development
```bash
make run-sb    # Storybook for component development
make run-eslint # ESLint for code quality
```

## Important Notes

### Code Generation Dependencies
- Always run `make gen` after modifying `/openapi/openapi.yaml`
- Generated code should not be manually edited
- Type safety flows from OpenAPI spec to both backend and frontend

### Environment Management
- Development: `compose.yml`
- Staging: `compose.stg.yml` 
- Production: `compose.prod.yml`
- Database only: `compose.db.yml`

### Documentation
- Primary docs in Notion workspace (linked in README.md)
- API documentation auto-generated from OpenAPI spec
- Git workflow and commit rules documented in Notion

## Git Workflow & PR Rules

### Pull Request Template
When creating PRs, use the template in `.github/pull_request_template.md`:
- **対応Issue**: Link related issue number with `resolve #XXX`
- **概要**: Clear description of changes
- **画面スクリーンショット等**: Screenshots if UI changes
- **テスト項目**: Test items for reviewers
- **備考**: Additional notes

### Branch Naming Convention
- `feat/username/feature-description` for new features
- `fix/username/bug-description` for bug fixes
- Follow patterns from recent commits

### Commit Guidelines
- Write descriptive commit messages in Japanese or English
- Reference issue numbers when applicable
- Use conventional commit format when possible

## AI Assistant Context

### GitHub Copilot Configuration
- Custom instructions configured with Japanese IT gal persona (`.github/copilot-instructions.md`)
- Responds in Japanese with friendly gal language and emojis
- Professional IT engineer with B-type personality

### Development Principles
- Follow existing patterns and conventions
- Focus on type safety and clean architecture
- Always run `make gen` after OpenAPI changes
- Run `make run-eslint` and `make format` before committing frontend changes