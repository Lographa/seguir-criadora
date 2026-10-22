# Seguir criadora

Aplicação de demonstração em que um usuário pode **seguir** e **deixar de seguir** uma criadora de conteúdo e ver quantos seguidores ela tem. O projeto tem uma API REST (backend) e uma tela simples que a consome (frontend).

Ao subir o backend pela primeira vez, a criadora **Ana Criadora** (`creator-1`) é cadastrada automaticamente. A tela mostra o nome dela, o número de seguidores e um botão "Seguir" / "Deixar de seguir".

## Stack

| Parte | Tecnologias |
|---|---|
| Backend (`backend/`) | Node.js, NestJS 12, TypeScript, TypeORM, SQLite (`better-sqlite3`), `@nestjs/config`, `class-validator` |
| Testes do backend | Jest, Supertest (e2e, com SQLite em memória) |
| Frontend (`frontend/`) | React 19, TypeScript, Vite, `fetch` e CSS puro (sem bibliotecas extras) |

## Pré-requisitos

- **Node.js** `^20.19`, `^22.13` ou `>=24.11` (faixa exigida pelas dependências) e **npm**.
- Foi executado e verificado apenas com **Node 26.3.1** e **npm 11.16.0**, no Windows. As outras versões da faixa acima não foram testadas.
- Não é preciso instalar o SQLite: o driver `better-sqlite3` vem com o `npm install`.

## Estrutura

```
.
├── package.json        # atalhos para rodar backend, frontend e testes (sem dependências)
├── backend/            # API NestJS
│   ├── src/
│   │   ├── controllers/  # rotas HTTP
│   │   ├── services/     # regras de negócio
│   │   ├── entities/     # Creator e Follower (TypeORM)
│   │   ├── dto/          # validação de entrada
│   │   └── config/       # validação das variáveis de ambiente
│   ├── test/             # testes e2e (Jest + Supertest)
│   └── .env.example
├── frontend/           # tela React + Vite
│   ├── src/
│   └── .env.example
└── PROMPTS.md          # registro dos prompts usados no desenvolvimento
```

## Configuração

Instale as dependências dos dois projetos (a partir da raiz):

```bash
npm run install:all
```

Isso equivale a rodar `npm install` dentro de `backend/` e de `frontend/`.

Os arquivos `.env` são **opcionais**: sem eles, valem os valores padrão da tabela abaixo. Para personalizar, copie os exemplos:

```powershell
# PowerShell (Windows)
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

```bash
# Linux / macOS
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Variáveis de ambiente

| Projeto | Variável | Padrão | Descrição |
|---|---|---|---|
| backend | `PORT` | `3000` | Porta HTTP da API. Precisa ser um inteiro entre 1 e 65535; caso contrário a aplicação não sobe. |
| backend | `DB_PATH` | `./data/database.sqlite` | Caminho do arquivo SQLite, relativo à pasta `backend/`. A pasta é criada automaticamente. |
| backend | `FRONTEND_ORIGIN` | `http://localhost:5173` | Origem autorizada no CORS. Aceita várias, separadas por vírgula. |
| frontend | `VITE_API_URL` | `http://localhost:3000` | URL base da API. |

Se mudar `PORT` no backend, ajuste também `VITE_API_URL` no frontend. O Vite lê o `.env` ao iniciar, então reinicie o `npm run dev` depois de alterá-lo.

## Como executar

Use **dois terminais**, a partir da raiz do projeto.

**Terminal 1: backend** (`http://localhost:3000`)

```bash
npm run start:backend    # compila e inicia
# ou, em modo de desenvolvimento, com recarga automática:
npm run dev:backend
```

**Terminal 2: frontend** (`http://localhost:5173`)

```bash
npm run dev:frontend
```

Abra `http://localhost:5173` no navegador. O frontend está configurado com `strictPort`: se a porta 5173 estiver ocupada, o Vite falha em vez de escolher outra, porque outra porta não seria aceita pelo CORS do backend.

### Atalhos da raiz

Os scripts do `package.json` da raiz só repassam comandos para as pastas `backend/` e `frontend/` (via `npm --prefix`). Eles não têm dependências próprias.

| Comando | O que faz |
|---|---|
| `npm run install:all` | Instala as dependências do backend e do frontend |
| `npm run start:backend` | Compila e inicia o backend |
| `npm run dev:backend` | Inicia o backend com recarga automática |
| `npm run dev:frontend` | Inicia o frontend (Vite) |
| `npm run build` | Compila o backend e faz o build do frontend (com checagem de tipos) |
| `npm test` / `npm run test:e2e` | Roda os testes e2e do backend |

Os mesmos comandos funcionam dentro de cada pasta: no `backend/`, `npm run build`, `npm start`, `npm run start:dev` e `npm run test:e2e`; no `frontend/`, `npm run dev`, `npm run build` e `npm run typecheck`.

## Testes

```bash
npm test
```

São **42 testes e2e** em `backend/test/followers.e2e-spec.ts`, que sobem a aplicação real (com a mesma validação e o mesmo CORS) e fazem requisições HTTP com Supertest. Eles cobrem seguir, seguir duas vezes, criadora inexistente, `userId` inválido, deixar de seguir, deixar de seguir sem seguir, contagem de seguidores em várias situações e o campo `isFollowing` na consulta da criadora.

- Cada teste usa uma aplicação nova com um **banco SQLite em memória** próprio, já com a criadora inicial. Não há dependência entre testes, e o banco de desenvolvimento nunca é usado (`DB_PATH=:memory:` é forçado pelo setup, mesmo que exista um `backend/.env`).
- O script roda o Jest com `node --experimental-vm-modules`, porque o Nest 12 e o TypeORM 1.x são pacotes ESM. Por isso aparece um `ExperimentalWarning` na saída. É esperado.
- **Não há testes automatizados do frontend.**

## API

Base: `http://localhost:3000`. Corpo e respostas em JSON. Erros seguem o formato do NestJS: `{ "statusCode": 404, "error": "Not Found", "message": "..." }`. Em erros de validação (400), `message` pode ser uma lista de textos.

| Método | Rota | Objetivo | Códigos principais |
|---|---|---|---|
| `POST` | `/creators/:creatorId/followers` | Seguir a criadora. Body: `{ "userId": "..." }` | `201` seguiu · `400` userId inválido · `404` criadora não existe · `409` já seguia |
| `DELETE` | `/creators/:creatorId/followers/:userId` | Deixar de seguir | `204` removeu (sem corpo) · `400` userId inválido · `404` criadora ou relacionamento não existe |
| `GET` | `/creators/:creatorId/followers/count` | Consultar a quantidade de seguidores | `200` · `404` criadora não existe |
| `GET` | `/creators/:id?userId=...` | Consultar a criadora (**endpoint adicional**) | `200` · `400` userId informado mas inválido · `404` criadora não existe |

Exemplos de resposta de sucesso:

```jsonc
// POST /creators/creator-1/followers   body: { "userId": "user-demo" }  ->  201
{ "creatorId": "creator-1", "userId": "user-demo", "createdAt": "2026-10-21T22:23:51.000Z" }

// GET /creators/creator-1/followers/count  ->  200
{ "creatorId": "creator-1", "followersCount": 2 }

// GET /creators/creator-1?userId=user-demo  ->  200
{ "id": "creator-1", "name": "Ana Criadora", "followersCount": 2, "isFollowing": true }
```

Exemplo com `curl`:

```bash
curl -X POST http://localhost:3000/creators/creator-1/followers \
  -H "Content-Type: application/json" -d '{"userId":"user-demo"}'
curl "http://localhost:3000/creators/creator-1?userId=user-demo"
curl -X DELETE http://localhost:3000/creators/creator-1/followers/user-demo
```

## Decisões de negócio

O enunciado original não detalha todos os pontos, então estas foram as decisões adotadas.

### Códigos de resposta

- **400, dados inválidos.** O `userId` precisa ser um texto, não vazio depois de remover os espaços das pontas (`trim`) e ter no máximo 100 caracteres. É rejeitado: ausente, vazio, só espaços, `null`, número, booleano, array, objeto, mais de 100 caracteres e JSON malformado. A validação vale para o body do POST, para o `:userId` do DELETE e para o `?userId=` da consulta da criadora. Campos extras no body são ignorados. A validação do `userId` acontece **antes** da checagem da criadora, então um `userId` inválido dá 400 mesmo que a criadora não exista.
- **404, não encontrado.** Dois casos: a criadora não existe (qualquer endpoint) ou, no DELETE, o usuário não segue aquela criadora. As mensagens diferem para distinguir os dois.
- **409, conflito.** O usuário tenta seguir uma criadora que já segue. Além da checagem no serviço, há uma **restrição única** `(creatorId, userId)` no banco, que protege contra duas requisições simultâneas. O 409 não altera a contagem.
- **204, sucesso sem corpo.** O DELETE devolve 204 ao remover o relacionamento. Repetir o DELETE depois disso devolve 404.

### Outras decisões

- **`userId` é opaco e sem autenticação.** A API aceita qualquer texto como `userId` e confia no cliente, sem login. O mesmo usuário com espaços nas pontas (`" user-1 "`) é tratado como `user-1`.
- **Seed da criadora inicial.** Ao iniciar a aplicação, se não existir uma criadora com id `creator-1`, ela é cadastrada com o nome "Ana Criadora". Se já existir, nada acontece, então reiniciar não duplica nem apaga dados.
- **Endpoint adicional `GET /creators/:id`.** Foi criado para dar ao frontend, em uma só chamada, o nome, a contagem e se o usuário já segue. O `userId` é opcional: sem ele, `isFollowing` vem `false`. O campo se chama `isFollowing`.
- **`userId` fixo no frontend.** Como não há login, o frontend usa o usuário de demonstração `user-demo`, definido como constante em `frontend/src/config.ts`, junto com o `creatorId` `creator-1`. Para testar como outro usuário, altere essa constante.
- **Atualização da tela.** O POST não devolve a nova contagem e o DELETE não tem corpo. Depois de uma ação bem-sucedida, o frontend atualiza a tela imediatamente e em seguida refaz o `GET` para pegar a contagem real. Se a API responder 409 ou 404 (tela desatualizada), ele mostra a mensagem da API e ressincroniza com o `GET`. O botão fica desabilitado enquanto há uma requisição em andamento.
- **Erros no frontend.** Falha de rede, erro de carregamento inicial (com botão "Tentar novamente") e respostas HTTP de erro aparecem como mensagem na tela.
- **Banco e tabelas.** Usa `synchronize: true` do TypeORM, que cria as tabelas automaticamente. É prático para este desafio; em produção o ideal seriam migrations.

## Problemas comuns

- **`EADDRINUSE` ao subir o backend:** a porta já está em uso. Pare o outro processo ou mude `PORT` (e `VITE_API_URL` no frontend).
- **Frontend mostra "Não foi possível conectar à API":** o backend não está rodando, ou `VITE_API_URL` aponta para o endereço errado.
- **Erro de CORS no navegador:** a origem do frontend precisa estar em `FRONTEND_ORIGIN` no backend (padrão `http://localhost:5173`).
- **Aviso do npm sobre `better-sqlite3` ("install script not yet covered by allowScripts"):** é só um aviso e, nas instalações que fiz, o driver funcionou normalmente. Se aparecer erro de módulo nativo ao subir o backend, rode `npm rebuild better-sqlite3` dentro de `backend/`. Esse comando não foi necessário nos meus testes.
- **Zerar os dados locais:** pare o backend e apague `backend/data/` (ou o arquivo de `DB_PATH`). Ele é recriado, com a criadora inicial, na próxima subida.
