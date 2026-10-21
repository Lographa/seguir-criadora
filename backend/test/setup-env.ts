// Roda antes de cada arquivo de teste, antes de qualquer módulo da aplicação ser carregado.
// As variáveis de process.env têm prioridade sobre o arquivo .env, então mesmo que exista um
// backend/.env apontando para o banco de desenvolvimento, os testes continuam em memória.
process.env.DB_PATH = ':memory:';
process.env.PORT = '3000';
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
