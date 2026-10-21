## Prompt 1

**Ferramenta: ** Claude Sonnet 5.5

**Texto do prompt: ** Quero implementar o backend do desafio de seguir criadoras usando NestJS, TypeScript, TypeORM e SQLite, dentro da pasta backend/.
Preciso de duas entidades: Creator, com id e name, e Follower, relacionando creatorId e userId, com data de criação. Um usuário não pode seguir a mesma criadora duas vezes. Ao iniciar a aplicação, cadastre a criadora "Ana Criadora", com id "creator-1", caso ela ainda não exista.
Implemente os endpoints para seguir, deixar de seguir e consultar a quantidade de seguidores, conforme o enunciado. Também crie um endpoint para consultar a criadora pelo id, retornando seu nome, quantidade de seguidores e se o userId informado está seguindo ela.
Valide o userId recebido no POST. Use 400 para dados inválidos, 404 para criadora ou relacionamento inexistente e 409 quando o usuário já estiver seguindo a criadora. O DELETE deve retornar 204 quando funcionar.
Configure PORT, DB_PATH e FRONTEND_ORIGIN por variáveis de ambiente, usando @nestjs/config. Inclua um .env.example e atualize o .gitignore para não versionar arquivos de ambiente ou o banco local.
Organize o código de forma simples, separando controllers, services, entidades e DTOs. Não faça o frontend nem os testes ainda.
Antes de terminar, explique como executar o backend e quais decisões você tomou para os detalhes que o enunciado não especifica. Não diga que algo foi testado se não tiver executado os testes.

**Por que este prompt: ** Neste prompt, queria resolver a parte de criação total do backend dentro de um arquivo backend e já ir configurando com o banco de dados definido em SQLite, por conta do escopo e prazo serem curtos, então escolhi um banco mais simples e com menos configuração. Já mantive toda a configuração de CORS, postagem e URL sendo criadas, mas sem criar o frontend ainda. E, para já poder testar se está rodando, eu finalizei pedindo o comando para executar.

**O que a IA entregou: ** Backend em NestJS com as pastas configuradas em service, controller, entities, os DTOs, PATH, configurações necessárias e criação do banco de dados já com 1 usuário.

**O que estava errado ou faltando, e o que você fez: ** Ainda faltam frontend e testes concretos.
** Como você conferiu: ** Testes feitos por meio do Postman.

## Prompt 2

**Ferramenta: ** Claude Sonnet

**Texto do prompt: ** No backend que já existe em backend/, crie testes e2e para a API usando Jest e Supertest.
Use um banco SQLite em memória para os testes, sem alterar nem utilizar o banco de desenvolvimento. Garanta que a criadora inicial seja cadastrada e que os testes não dependam dos dados deixados por outros testes.
Cubra os principais cenários: seguir uma criadora, tentar seguir duas vezes, seguir uma criadora inexistente, enviar um userId inválido, deixar de seguir, tentar deixar de seguir sem estar seguindo, conferir a contagem de seguidores em diferentes situações e verificar o campo following no endpoint de consulta.
Confira também se o script test:e2e está configurado corretamente no package.json. Execute os testes e corrija apenas o que for necessário para fazê-los funcionar, sem mudar as regras da API desnecessariamente.
Ao terminar, informe quais testes foram executados, se passaram e quais arquivos ou comportamentos precisaram ser ajustados

**Por que este prompt: ** Manter um comando todo só para teste, para manter a integridade do código e verificar se todas as chamadas, funções e salvamento no banco estão seguindo conforme a necessidade do enunciado. Não seria de extrema confiabilidade só contar com chamadas manuais via Postman.

**O que a IA entregou: ** Teste completo no backend.

**O que estava errado ou faltando, e o que você fez: ** Estava faltando configurar o comando no package.json e importar as libs necessárias, resolvidas por meio do comando.

** Como você conferiu: ** Rodando todos os comandos no package.json e revendo através do Postman.
