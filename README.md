# 🎟️ Plataforma de Eventos e Ingressos - API

Back-end desenvolvido em **NestJS** e **Prisma ORM** com banco de dados **PostgreSQL**, seguindo os princípios de **Domain-Driven Design (DDD)** em uma arquitetura de **Monolito Modular com Bounded Contexts**.

Projeto desenvolvido para o **Desafio Elite Dev da Verzel**.

---

## 🔗 Repositórios do Projeto

- **Back-End (API)**: Este repositório
- **Front-End (SPA)**: `verzel-challenge-spa`

---

## 📐 Documentação Arquitetural e Diagramas

Para detalhes aprofundados sobre a modelagem de entidades, diagramas de classe, DER e decisões de desacoplamento, consulte:
👉 **[Documentação de Arquitetura & Diagramas (docs/architecture.md)](docs/architecture.md)**

---

## 🛠️ Tecnologias Utilizadas

- **Runtime & Framework**: [Node.js](https://nodejs.org/) com [NestJS 11](https://nestjs.com/) e TypeScript
- **Banco de Dados**: [PostgreSQL 16](https://www.postgresql.org/) rodando via [Docker Compose](https://docs.docker.com/compose/)
- **ORM & Migrations**: [Prisma ORM](https://www.prisma.io/)
- **Criptografia & Segurança**: [bcrypt](https://github.com/kelektiv/node.bcrypt.js) para senhas e HMAC-SHA256 para assinatura de QR Codes
- **Testes**: Jest para testes unitários e de integração

---

## 🚀 Como Configurar e Executar

### Pré-requisitos
- **Node.js**: >= 20.x
- **Docker** e **Docker Compose** instalados

### Passo a Passo

```bash
# 1. Clonar o repositório e entrar na pasta
git clone <url-do-repositorio-api>
cd api

# 2. Instalar as dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env

# 4. Subir o banco de dados PostgreSQL via Docker
docker compose up -d

# 5. Executar as migrações do banco de dados e gerar o Prisma Client
npm run prisma:migrate

# 6. Popular o banco com os dados iniciais de teste (Seed)
npm run prisma:seed

# 7. Iniciar o servidor de desenvolvimento
npm run start:dev
```

A API estará rodando em: `http://localhost:3000`

---

## 👤 Credenciais de Teste (Seed Data)

O banco de dados é inicializado com usuários pré-cadastrados para todos os papéis da aplicação.

> **Senha padrão para todos os usuários**: `Password123!`

| Papel | Nome | E-mail | Descrição / Permissões |
| :--- | :--- | :--- | :--- |
| **ORGANIZADOR** | Carlos Organizador | `organizador@verzel.com` | Cria e gerencia eventos, define lotes e assentos |
| **CLIENTE** | Ana Cliente | `cliente1@verzel.com` | Reserva assentos, realiza checkout e acessa ingressos |
| **CLIENTE** | Bruno Silva | `cliente2@verzel.com` | Segundo cliente para testes de concorrência |
| **PORTARIA** | Marcos Portaria | `portaria@verzel.com` | Valida QR Codes de ingressos na portaria do evento |

### 🎭 Eventos Semeados:
1. **"Interstellar - Sessão Especial IMAX"**:
   - Tipo: `SEATED` (com mapa de assentos)
   - Preço: R$ 45,00 | Capacidade: 60 lugares
   - Origem: Catálogo TMDb
   - *Inclui 1 ingresso válido emitido para a Ana (Assento C5) e 1 ingresso já validado para o Bruno (Assento C6).*
2. **"Coldplay - Music of the Spheres Tour"**:
   - Tipo: `GENERAL` (Pista / Por quantidade)
   - Preço: R$ 280,00 | Capacidade: 2500 pessoas
   - Origem: Catálogo Ticketmaster

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev        # Inicia a API em modo watch
npm run start:debug      # Inicia em modo debug

# Banco de Dados & Prisma
npm run prisma:migrate   # Aplica migrations pendentes no banco
npm run prisma:generate  # Regenera o client TypeScript do Prisma
npm run prisma:seed      # Executa o seed de usuários e eventos
npm run prisma:studio    # Abre a interface visual do Prisma Studio

# Testes & Qualidade
npm run test             # Executa testes unitários
npm run test:e2e         # Executa testes end-to-end
npm run lint             # Executa o ESLint para validação de código
npm run format           # Formata o código com Prettier
```
