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

## Prompt 3

**Ferramenta: ** Claude Sonnet
**Texto do prompt: ** Crie, na pasta frontend/, uma aplicação React com TypeScript com Vite para consumir o backend existente.
A tela deve mostrar o nome da criadora, a quantidade de seguidores e um botão para seguir ou deixar de seguir. Use fetch para chamar a API, com a URL base configurada em VITE_API_URL (padrão http://localhost:3000), o creatorId creator-1 e um userId fixo de demonstração (user-demo), definido em uma constante.
Ao carregar a página, consulte GET /creators/creator-1?userId=user-demo para obter os dados iniciais. Ao clicar no botão, use os endpoints existentes de POST e DELETE e atualize a tela conforme a resposta da API.
Trate o carregamento inicial, erros de rede e respostas HTTP de erro, mostrando uma mensagem na tela. Desabilite o botão enquanto uma requisição estiver em andamento para evitar cliques repetidos.
Crie frontend/.env.example com a variável VITE_API_URL. Use CSS puro, com um visual simples e organizado, sem adicionar bibliotecas além das necessárias para React e Vite.
Não altere o backend. Ao terminar, informe como executar o frontend e quais arquivos foram criados.

**Por que este prompt: ** Optei por usar este prompt na parte do front, já pegando dados de teste e dados do primeiro usuário para demonstração. Apenas pedindo para criar uma tela básica com as funções necessárias e testá-las.

**O que a IA entregou: ** Frontend e teste no front.
**O que estava errado ou faltando, e o que você fez: ** ...
** Como você conferiu: ** Teste feito para cada resposta de status por meio do próprio prompt.

## Prompt 4

**Ferramenta: ** Claude Sonnet
**Texto do prompt: ** Prepare a documentação e os arquivos necessários para executar e entregar o projeto.
Coloque no README.md na raiz explicando o objetivo do projeto, a stack utilizada, os pré-requisitos e como configurar e executar backend, frontend e testes. Inclua uma tabela com os endpoints, seus objetivos e os principais códigos HTTP retornados.
Documente também as decisões de negócio adotadas, incluindo os casos 400, 404, 409 e 204, o seed da criadora inicial, o userId fixo de demonstração no frontend e o endpoint adicional de consulta da criadora.
Revise o .gitignore para garantir que arquivos .env, bancos SQLite locais, node_modules e diretórios de build não sejam versionados, mantendo os arquivos .env.example.
Se fizer sentido para a estrutura atual, crie um package.json na raiz com scripts simples para executar backend, frontend e testes sem precisar entrar manualmente em cada pasta. Não duplique dependências nem altere os package.json existentes sem necessidade.
Não altere a lógica funcional da API ou do frontend. Ao terminar, liste os arquivos criados ou modificados e os comandos que você executou para verificar a entrega.

**Por que este prompt: ** Esse último prompt iria resolver toda a parte de documentação e finalização do projeto, revisando o que não precisa ser enviado via gitignore e criando nova configuração global para package.json para facilitar a inicialização do projeto. Além também de documentá-lo no README.md.

**O que a IA entregou: ** Documentação no README, configuração global do package json e revalidade gitignore.
**O que estava errado ou faltando, e o que você fez: ** Estava faltando documentação e configuração global.
** Como você conferiu: ** Todo resultado conferido pelo que foi entregue do comando pela IA.

## Prompt 5

**Ferramenta: ** Claude Sonnet
**Texto do prompt: ** Revise o projeto completo antes da entrega. Confira se o backend, frontend e os testes estão funcionando.Execute os testes automatizados e verifique se as instruções do README permitem configurar e executar o projeto.
Corrija apenas problemas reais que encontrar, mantendo o escopo e as decisões de negócio existentes. Não adicione funcionalidades nem refatore código que já funciona sem necessidade.
Ao terminar, informe quais verificações executou, os resultados obtidos, os arquivos alterados e o que ainda precisa de conferência manual. Não declare nenhuma verificação como aprovada se ela não tiver sido executada.

**Por que este prompt: ** Para verificar se todos os testes necessários foram feitos, se ainda existe algum ponto necessário a ser revisado.
**O que a IA entregou: ** Teste total do código.
**O que estava errado ou faltando, e o que você fez: ** Nada
** Como você conferiu: ** Através do resultado entregue pelo prompt no final.

Decisões que tomei: Tomei a decisão de dividir a implementação por etapas, com cada prompt para cada parte do projeto, para manter um controle sobre o que está sendo feito e facilitar o acompanhamento das alterações.
Em cada prompt, tentei seguir uma regra de que o que ele deve usar, detalhes da implementação, configurações, requisitos, organização, execução apenas do que for pedido para evitar alterações fora do escopo e dizer o que foi feito e como ativar o código. Para criação do prompt, eu usei site de checagem de ortografia para facilitar a leitura do prompt. Mantive o uso do Claude Sonnet por ser o mais robusto e pelo tempo para criar o projeto.

O que não verifiquei: Todo sistema só foi feito na versão Node 26.3.1 e npm 11.16.0. Não tive tempo para testar em outras anteriores. Passando uns 20 minutos depois do tempo limite.
