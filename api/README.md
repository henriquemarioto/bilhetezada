# Bilhetezada API

Backend do projeto **Bilhetezada**.

## Tecnologias Utilizadas

- **Backend**: [NestJS](https://nestjs.com/) (API Rest)
- **Banco de Dados**: [MySql](https://www.mysql.com/) (Banco de dados)
- **Cache**: [Redis](https://redis.io/)
- **Autenticação**: JWT
- **Validação de QR Code**: Criptografia com hash e chave secreta

---

## Como Rodar o Projeto Localmente

1. Clone o repositório:
   ```bash
   git clone git@github.com:henriquemarioto/bilhetezada.git
   cd bilhetezada
   ```

2. Rode com docker:
   ```bash
   docker compose up
   ```

O projeto estará disponível em `http://localhost:3132`.

---

## Migrations

Aqui está o que cada comando faz e quando você deve usá-lo:

---

### **1. `migration:run`**
```bash
npm run migration:run
```

#### **O que faz?**
Esse comando executa as migrações pendentes no banco de dados. Ele aplica as mudanças definidas nos arquivos de migração (normalmente na pasta `src/migrations`) que ainda não foram aplicadas.

#### **Quando usar?**
- Após criar novas migrações e precisar aplicá-las ao banco.
- Ao configurar o ambiente (ex.: local, staging ou produção) e precisar garantir que o esquema do banco esteja atualizado.

---

### **2. `migration:generate`**
```bash
npm run migration:generate --name add-status-to-user
```

#### **O que faz?**
Esse comando gera automaticamente um arquivo de migração com base nas alterações detectadas no esquema das entidades TypeORM. Ele compara o estado atual do banco de dados com as entidades definidas no código.

- O valor de `$npm_config_name` será substituído pelo nome da migração que você passar no momento da execução com a flag --name=nome_da_migration.

#### **Quando usar?**
- Quando você modificou as entidades (ex.: adicionou ou removeu colunas/tabelas) e precisa criar um arquivo de migração correspondente.

---

### **3. `migration:create`**
```bash
npm run migration:create --name rename-user-table
```

#### **O que faz?**
Esse comando cria um arquivo de migração vazio. Diferente do `migration:generate`, ele não analisa as entidades automaticamente. É útil quando você precisa escrever manualmente a lógica de migração.

- O valor de `$npm_config_name` será substituído pelo nome da migração que você passar.

#### **Quando usar?**
- Quando você quer criar uma migração personalizada que não pode ser gerada automaticamente.
- Para casos complexos, como execuções específicas de SQL ou manipulação de dados.

---

### **4. `migration:revert`**
```bash
npm run migration:revert
```

#### **O que faz?**
Esse comando reverte a última migração aplicada ao banco de dados. Ele usa a lógica definida no método `down` de cada migração para desfazer as alterações.

#### **Quando usar?**
- Quando você aplicou uma migração incorretamente e precisa reverter.
- Para testes, quando precisa desfazer mudanças no banco após validar uma migração.

---

### **Resumo dos comandos e seu uso**
| Comando             | O que faz?                                              | Quando usar?                                         |
|---------------------|---------------------------------------------------------|----------------------------------------------------|
| `migration:run`     | Executa todas as migrações pendentes.                   | Após criar novas migrações ou configurar o ambiente. |
| `migration:generate`| Gera uma migração automaticamente a partir das entidades. | Quando modifica as entidades e quer refletir isso no banco. |
| `migration:create`  | Cria uma migração vazia para escrita manual.            | Para migrações personalizadas ou complexas.         |
| `migration:revert`  | Reverte a última migração aplicada.                     | Para desfazer mudanças ou corrigir erros.           |

---
