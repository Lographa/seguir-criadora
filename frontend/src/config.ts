const DEFAULT_API_URL = 'http://localhost:3000';

/** URL base da API (VITE_API_URL), sem barra no final. */
export const API_URL = (import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL).replace(
  /\/+$/,
  '',
);

/** Criadora exibida na tela. */
export const CREATOR_ID = 'creator-1';

/** Usuário fixo de demonstração (ainda não há login). */
export const DEMO_USER_ID = 'user-demo';
