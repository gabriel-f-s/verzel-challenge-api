# EliteTickets - API & Main Repository 🚀

**Plataforma de Eventos e Ingressos** completa para o desafio técnico "Desafio Elite Dev" da Verzel.

Link da API em produção [aqui](https://verzel-challenge-api.onrender.com/). (_OBS: devido o plano free da render, a api dorme quando está inativa, então o primeiro acesso pode demorar um pouco mais para responder_)

---

## 🎯 Arquitetura & Decisões Técnicas (Back-End)

Tomei decisões arquiteturais cruciais visando criar um software escalável, sustentável e seguindo os princípios de **Clean Architecture**, **DDD (Domain-Driven Design)**, **SOLID** e **KISS**.

### NestJS + Prisma + PostgreSQL

- **Desacoplamento de Domínio**: As entidades (ex: `User`, `Event`, `Ticket`) e enums (`Type`, `TicketStatus`, `ValidationStatus`) são modelados como classes TypeScript puras. Elas não possuem nenhuma dependência das classes do Prisma ou dos decoradores do NestJS, o que blinda a lógica de negócio principal.
- **Anti-Corruption Layer (ACL)**: O `IntegrationsModule` funciona como uma camada de anti-corrupção, isolando a comunicação de rede e os contratos instáveis da API externa do TheMovieDB (TMDb) do nosso domínio interno.
- **Anti-Concorrência em Assentos (O Core do Desafio)**: A reserva de assentos marcados em eventos do tipo `SEATED` acontece por meio de uma transação isolada (`prisma.$transaction`). Isso soluciona o clássico problema de concorrência e **garante matematicamente que o mesmo lugar nunca seja vendido duas vezes**, retornando um erro limpo (HTTP 409) em caso de colisão entre dois clientes no exato mesmo milissegundo.
- **Criptografia Anti-Fraude (HMAC)**: Os QR Codes emitidos **não** carregam IDs fáceis de burlar ou um status boolean em texto plano. Eles carregam uma **Assinatura HMAC-SHA256**. Esta assinatura criptográfica é gerada misturando o ID do evento, ID do cliente, Data e um segredo (Secret) do servidor. É matematicamente impossível forjar ou alterar um QR code externamente sem conhecer a chave secreta.

---

## 🤖 Metodologia & Uso de IA (Pair Programming)

Fiz o uso da I.A para me auxiliar em trechos de código, documentação e planejamento do projeto. Onde fiz o uso de "pair programming" revisando e testando todo código antes de commitar.

- **Arquitetura**: Atuei como líder técnico, impondo as restrições e exigindo da IA os padrões estruturais (ex: manter a Anti-Corruption Layer, usar transações no Repositório para os tickets, separar papéis de usuário em Enums limpos).
- **Execução e Refatoração (Velocidade)**: Com a arquitetura garantida, acionei a IA para gerar as rotas repetitivas do CRUD e acelerar a construção mecânica dos DTOs.
- **Auditoria de Código**: Utilizei a IA para verificar brechas e analisar casos de ponta. A decisão do HMAC foi validada ativamente nesse fluxo. No fim, impedi "AI Slop" ao assumir total controle do resultado estético e logico das pastas.

---

## 🛠️ Tecnologias Utilizadas (API)

- **Node.js v18+** & **NestJS** (Dependency Injection nativo e padronização modular).
- **TypeScript** em Strict Mode.
- **Prisma ORM** servindo de repositório abstraído para o **PostgreSQL**.
- **Bcrypt** para hashes seguros de senhas.
- **Jest** focado para entregar testes unitários consistentes nos serviços vitais.

---

## 🚀 Como Rodar e Testar

### 1. Banco de Dados e Configuração

Abra um terminal, acesse a pasta da API:

```bash
cd api
```

Crie o arquivo `.env` baseado no arquivo de exemplo e preencha suas chaves:

```bash
cp .env.example .env
```

_(No mínimo, você precisa de um banco `DATABASE_URL` do Postgres válido e da `TMDB_API_KEY` para as buscas do organizador)._

### 2. Instalação e Seeding (Dados Iniciais)

Instale as dependências do back-end, aplique a modelagem no banco (Schema) e rode o Seeding:

```bash
npm install
npx prisma db push
npx prisma generate
npm run prisma:seed
```

> 💡 **MUITO IMPORTANTE:** O comando `npm run prisma:seed` limpará o banco (se houver dados sujos) e injetará exatamente 1 Organizador, 2 Clientes, 1 Portaria e 1 Filme configurado com lugares disponíveis. Não é preciso cadastrar ninguém na mão para ver a aplicação rodando!

### 3. Iniciar a Aplicação

Suba o servidor de desenvolvimento:

```bash
npm run start:dev
```

A API escutará na porta `3000`. O **Swagger UI** com toda a coleção de rotas ficará disponível em `http://localhost:3000/api`.

---

## 🔐 Dados de Teste (Criados via Seed)

Para facilitar a verificação dos três papéis, utilize estas credenciais cadastradas via Seed:

- **Senha Global para todas as contas:** `Password123!`

| Conta / Papel   | E-mail de Teste          | O que fazer?                                                                                                           |
| :-------------- | :----------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **Organizador** | `organizador@verzel.com` | Logue no Front-End, busque eventos e edite configurações.                                                              |
| **Cliente**     | `cliente1@verzel.com`    | Navegue pelo catálogo, reserve cadeiras, faça o pagamento falso e receba os QR Codes gerados no menu "Meus Ingressos". |
| **Portaria**    | `portaria@verzel.com`    | Abra a área "Validador" e escaneie o código do cliente na tela com a câmera.                                           |

---

Feito com dedicação ☕ para a Verzel.
