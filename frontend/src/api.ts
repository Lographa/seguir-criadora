import { API_URL } from './config';
import type { Creator } from './types';

/**
 * Erro das chamadas à API.
 * - kind "network": o fetch falhou (API fora do ar, CORS, sem internet...), sem resposta HTTP.
 * - kind "http": a API respondeu com status de erro (400, 404, 409, 500...).
 */
export class ApiError extends Error {
  readonly kind: 'network' | 'http';
  readonly status?: number;

  constructor(kind: 'network' | 'http', message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

/** Extrai a mensagem do corpo de erro do NestJS ({ message: string | string[] }). */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === 'object' && 'message' in body) {
      const { message } = body as { message: unknown };
      if (Array.isArray(message)) return message.join('. ');
      if (typeof message === 'string' && message) return message;
    }
  } catch {
    // corpo ausente ou que não é JSON: usa a mensagem padrão abaixo
  }
  return `A API respondeu com erro ${response.status}.`;
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch (error) {
    // Requisição cancelada de propósito (AbortController): não é um erro para o usuário.
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(
      'network',
      `Não foi possível conectar à API em ${API_URL}. Verifique se o backend está rodando.`,
    );
  }

  if (!response.ok) {
    throw new ApiError('http', await readErrorMessage(response), response.status);
  }
  return response;
}

const creatorPath = (creatorId: string) => `/creators/${encodeURIComponent(creatorId)}`;

export async function getCreator(
  creatorId: string,
  userId: string,
  signal?: AbortSignal,
): Promise<Creator> {
  const query = new URLSearchParams({ userId });
  const response = await request(`${creatorPath(creatorId)}?${query}`, { signal });

  try {
    return (await response.json()) as Creator;
  } catch {
    throw new ApiError('http', 'A API enviou uma resposta inválida.', response.status);
  }
}

/** POST /creators/:creatorId/followers — 201 em caso de sucesso. */
export async function followCreator(creatorId: string, userId: string): Promise<void> {
  await request(`${creatorPath(creatorId)}/followers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
}

/** DELETE /creators/:creatorId/followers/:userId — 204 em caso de sucesso. */
export async function unfollowCreator(creatorId: string, userId: string): Promise<void> {
  await request(`${creatorPath(creatorId)}/followers/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
}
