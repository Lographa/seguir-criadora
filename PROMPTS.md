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
