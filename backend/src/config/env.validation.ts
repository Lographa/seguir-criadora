export interface EnvConfig {
  PORT: number;
  DB_PATH: string;
  FRONTEND_ORIGIN: string;
}

const DEFAULTS = {
  PORT: 3000,
  DB_PATH: './data/database.sqlite',
  FRONTEND_ORIGIN: 'http://localhost:5173',
};

/**
 * Valida as variáveis de ambiente na inicialização.
 * Se alguma estiver inválida, a aplicação falha ao subir com uma mensagem clara.
 */
export function validateEnv(raw: Record<string, unknown>): EnvConfig {
  const rawPort = String(raw.PORT ?? '').trim();
  const port = rawPort === '' ? DEFAULTS.PORT : Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT inválida: "${rawPort}". Informe um inteiro entre 1 e 65535.`);
  }

  const dbPath = String(raw.DB_PATH ?? '').trim() || DEFAULTS.DB_PATH;
  const frontendOrigin =
    String(raw.FRONTEND_ORIGIN ?? '').trim() || DEFAULTS.FRONTEND_ORIGIN;

  return { PORT: port, DB_PATH: dbPath, FRONTEND_ORIGIN: frontendOrigin };
}
