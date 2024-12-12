Esses comandos são scripts relacionados à ferramenta **TypeORM**, utilizada em projetos Node.js para interagir com bancos de dados usando mapeamento objeto-relacional (ORM). Cada comando se refere a uma funcionalidade específica para lidar com **migrações** no banco de dados.

Aqui está o que cada comando faz e quando você deve usá-lo:

---

### **1. `migration:run`**
```bash
npm run typeorm migration:run -- -d ./src/config/typeorm.ts
```

#### **O que faz?**
Esse comando executa as migrações pendentes no banco de dados. Ele aplica as mudanças definidas nos arquivos de migração (normalmente na pasta `src/migrations`) que ainda não foram aplicadas.

#### **Quando usar?**
- Após criar novas migrações e precisar aplicá-las ao banco.
- Ao configurar o ambiente (ex.: local, staging ou produção) e precisar garantir que o esquema do banco esteja atualizado.

#### **Exemplo de uso:**
Você adicionou uma nova coluna a uma tabela e criou uma migração para isso. Agora, use `migration:run` para aplicar essa mudança ao banco de dados.

---

### **2. `migration:generate`**
```bash
npm run typeorm -- -d ./src/config/typeorm.ts migration:generate ./src/migrations/$npm_config_name
```

#### **O que faz?**
Esse comando gera automaticamente um arquivo de migração com base nas alterações detectadas no esquema das entidades TypeORM. Ele compara o estado atual do banco de dados com as entidades definidas no código.

- O valor de `$npm_config_name` será substituído pelo nome da migração que você passar no momento da execução.

#### **Quando usar?**
- Quando você modificou as entidades (ex.: adicionou ou removeu colunas/tabelas) e precisa criar um arquivo de migração correspondente.

#### **Exemplo de uso:**
Você adicionou uma nova propriedade `status` à entidade `User`:
```typescript
@Column({ default: 'active' })
status: string;
```
Use o comando para criar uma migração que reflita essa alteração no banco:
```bash
npm run migration:generate --name add-status-to-user
```

O arquivo gerado conterá as instruções para criar a coluna `status` na tabela correspondente.

---

### **3. `migration:create`**
```bash
npm run typeorm -- migration:create ./src/migrations/$npm_config_name
```

#### **O que faz?**
Esse comando cria um arquivo de migração vazio. Diferente do `migration:generate`, ele não analisa as entidades automaticamente. É útil quando você precisa escrever manualmente a lógica de migração.

- O valor de `$npm_config_name` será substituído pelo nome da migração que você passar.

#### **Quando usar?**
- Quando você quer criar uma migração personalizada que não pode ser gerada automaticamente.
- Para casos complexos, como execuções específicas de SQL ou manipulação de dados.

#### **Exemplo de uso:**
Você quer criar uma migração para renomear uma tabela:
```bash
npm run migration:create --name rename-user-table
```
Depois, você edita o arquivo gerado e adiciona a lógica de migração:
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.renameTable('user', 'users');
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.renameTable('users', 'user');
}
```

---

### **4. `migration:revert`**
```bash
npm run typeorm -- -d ./src/config/typeorm.ts migration:revert
```

#### **O que faz?**
Esse comando reverte a última migração aplicada ao banco de dados. Ele usa a lógica definida no método `down` de cada migração para desfazer as alterações.

#### **Quando usar?**
- Quando você aplicou uma migração incorretamente e precisa reverter.
- Para testes, quando precisa desfazer mudanças no banco após validar uma migração.

#### **Exemplo de uso:**
Você aplicou uma migração que adiciona uma coluna ao banco, mas percebeu que ela está errada. Use:
```bash
npm run migration:revert
```
Isso removerá a coluna ou desfará qualquer outra mudança feita pela última migração.

---

### **Resumo dos comandos e seu uso**
| Comando             | O que faz?                                              | Quando usar?                                         |
|---------------------|---------------------------------------------------------|----------------------------------------------------|
| `migration:run`     | Executa todas as migrações pendentes.                   | Após criar novas migrações ou configurar o ambiente. |
| `migration:generate`| Gera uma migração automaticamente a partir das entidades. | Quando modifica as entidades e quer refletir isso no banco. |
| `migration:create`  | Cria uma migração vazia para escrita manual.            | Para migrações personalizadas ou complexas.         |
| `migration:revert`  | Reverte a última migração aplicada.                     | Para desfazer mudanças ou corrigir erros.           |

Com esses comandos, você consegue gerenciar e versionar o esquema do banco de dados de forma eficiente em projetos TypeORM.