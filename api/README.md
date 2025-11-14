# Bilhetezada API

Bilhetezada is a platform for organizing small events in Brazil, focusing on simplicity, accessibility and digital efficiency.

## Main Technologies Used

- **API Framework**: [NestJS](https://nestjs.com/) (REST API)
- **Database**: [MySQL](https://www.mysql.com/) (Database)
- **ORM**: [TypeORM](https://typeorm.io/) (ORM)
- **Cache**: [Redis](https://redis.io/) (Cache)
- **Request Data Validation**: [class-validator](https://github.com/typestack/class-validator) (Validation)
- **Authentication**: [JWT](https://jwt.io/) (Authentication)
- **QR Code Generation**: [QRCode](https://www.npmjs.com/package/qrcode) (QRCode)

---

## 📂 Estrutura de Pastas (MVP)

```
📦 src
┣ 📂 modules
┃ ┣ 📂 event
┃ ┃ ┣ 📜 event.module.ts
┃ ┃ ┣ 📜 event.controller.ts
┃ ┃ ┣ 📜 event.controller.spec.ts
┃ ┃ ┣ 📂 dtos
┃ ┃ ┃ ┣ 📜 create-event.dto.ts
┃ ┃ ┃ ┗ 📜 update-event.dto.ts
┃ ┃ ┣ 📂 entities
┃ ┃ ┃ ┗ 📜 event.entity.ts
┃ ┃ ┣ 📂 repositories
┃ ┃ ┃ ┗ 📜 event.repository.ts
┃ ┃ ┣ 📂 use-cases
┃ ┃ ┃ ┣ 📜 create-event.use-case.ts
┃ ┃ ┃ ┣ 📜 create-event.use-case.spec.ts
┃ ┃ ┃ ┣ 📜 update-event.use-case.ts
┃ ┃ ┃ ┗ 📜 update-event.use-case.spec.ts
┃ ┣ 📂 ticket
┃ ┣ 📂 customer 
┃ ┣ 📂 payment 
┃ ┣ 📂 sales 
┃ ┗ 📂 auth
┃
┣ 📂 core
┃ ┣ 📂 common
┃ ┃ ┣ 📜 base.use-case.ts
┃ ┃ ┣ 📜 base.repository.ts
┃ ┃ ┗ 📜 base.entity.ts
┃ ┣ 📂 decorators
┃ ┣ 📂 exceptions
┃ ┣ 📂 guards
┃ ┣ 📂 interfaces
┃ ┣ 📂 pipes
┃ ┗ 📂 validators
┃
┣ 📂 shared
┃ ┣ 📂 dtos
┃ ┣ 📂 enums
┃ ┣ 📂 services
┃ ┗ 📂 utils
┃
┣ 📂 config
┃ ┣ 📜 env.config.ts
┃ ┗ 📜 database.config.ts
┃
┣ 📂 infrastructure
┃ ┣ 📂 database
┃ ┃ ┣ 📂 typeorm
┃ ┃ ┃ ┣ 📂 migrations
┃ ┃ ┃ ┗ 📜 typeorm.config.ts
┃ ┣ 📂 cache
┃ ┃ ┗ 📜 redis.service.ts
┃ ┗ 📂 integrations                     # APIs externas, gateways de pagamento, etc.
┃
┣ 📂 test
┃ ┗ 📂 e2e                             # testes ponta a ponta
┃
┣ 📜 main.ts
┗ 📜 app.module.ts
```

---

## How to Run the Project Locally

1. Clone the repository:

   ```bash
   git clone git@github.com:henriquemarioto/bilhetezada.git
   cd bilhetezada
   ```

2. Run with Docker:
   ```bash
   docker compose up
   ```

The project will be available at `http://localhost:3132`.

---

## Migrations

Here’s what each command does and when you should use it:

### **1. `migration:run`**

```bash
npm run migration:run
```

**What does it do?**  
This command runs all pending migrations in the database. It applies the changes defined in migration files (usually in the `src/migrations` folder) that have not yet been applied.

**When to use?**

- After creating new migrations and needing to apply them to the database.
- When setting up an environment (e.g., local, staging, or production) and ensuring the database schema is up to date.

---

### **2. `migration:generate`**

```bash
npm run migration:generate --name add-status-to-user
```

**What does it do?**  
This command automatically generates a migration file based on detected changes in the TypeORM entity schema. It compares the current database state with the entities defined in the code.

**When to use?**

- When you modify entities (e.g., add or remove columns/tables) and need to create a corresponding migration file.

---

### **3. `migration:create`**

```bash
npm run migration:create --name rename-user-table
```

**What does it do?**  
This command creates an empty migration file. Unlike `migration:generate`, it does not automatically analyze entities. It is useful when you need to manually write migration logic.

**When to use?**

- When creating a custom migration that cannot be generated automatically.
- For complex cases such as specific SQL executions or data manipulation.

---

### **4. `migration:revert`**

```bash
npm run migration:revert
```

**What does it do?**  
This command reverts the last migration applied to the database. It uses the logic defined in the `down` method of each migration to undo changes.

**When to use?**

- When you applied a migration incorrectly and need to roll it back.
- For testing purposes, when you need to undo database changes after validating a migration.

---

### **Summary of Commands and Their Usage**

| Command              | What does it do?                                   | When to use?                                                    |
| -------------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| `migration:run`      | Runs all pending migrations.                       | After creating new migrations or setting up the environment.    |
| `migration:generate` | Automatically generates a migration from entities. | When modifying entities and reflecting changes in the database. |
| `migration:create`   | Creates an empty migration for manual writing.     | For custom or complex migrations.                               |
| `migration:revert`   | Reverts the last applied migration.                | To undo changes or fix errors.                                  |

---
