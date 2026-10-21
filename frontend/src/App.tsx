import { useEffect, useRef, useState } from 'react';
import { ApiError, followCreator, getCreator, unfollowCreator } from './api';
import { CREATOR_ID, DEMO_USER_ID } from './config';
import type { Creator } from './types';

type ScreenState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; creator: Creator };

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function toMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Ocorreu um erro inesperado. Tente novamente.';
}

function formatFollowers(count: number): string {
  return `${count.toLocaleString('pt-BR')} ${count === 1 ? 'seguidor' : 'seguidores'}`;
}

export default function App() {
  const [screen, setScreen] = useState<ScreenState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  // O estado "busy" só vale após a próxima renderização; a ref bloqueia cliques
  // repetidos que cheguem antes disso.
  const busyRef = useRef(false);

  // Carga inicial (e "Tentar novamente"): GET /creators/creator-1?userId=user-demo
  useEffect(() => {
    const controller = new AbortController();
    setScreen({ status: 'loading' });

    getCreator(CREATOR_ID, DEMO_USER_ID, controller.signal)
      .then((creator) => setScreen({ status: 'ready', creator }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        setScreen({ status: 'error', message: toMessage(error) });
      });

    return () => controller.abort();
  }, [reloadKey]);

  /** Busca os dados atuais na API. Se falhar, mantém o que já está na tela. */
  async function refresh() {
    try {
      const creator = await getCreator(CREATOR_ID, DEMO_USER_ID);
      setScreen({ status: 'ready', creator });
    } catch {
      // Sem problema: a tela já reflete o resultado da ação que acabou de dar certo.
    }
  }

  async function handleToggleFollow() {
    if (screen.status !== 'ready' || busyRef.current) return;
    const { creator } = screen;

    busyRef.current = true;
    setBusy(true);
    setActionError(null);

    try {
      if (creator.isFollowing) {
        await unfollowCreator(CREATOR_ID, DEMO_USER_ID);
      } else {
        await followCreator(CREATOR_ID, DEMO_USER_ID);
      }

      // A API confirmou (201/204): reflete na hora e depois confere a contagem real.
      const nowFollowing = !creator.isFollowing;
      setScreen({
        status: 'ready',
        creator: {
          ...creator,
          isFollowing: nowFollowing,
          followersCount: Math.max(0, creator.followersCount + (nowFollowing ? 1 : -1)),
        },
      });
      await refresh();
    } catch (error) {
      setActionError(toMessage(error));
      // 409 (já seguia) ou 404 (não seguia): a tela estava desatualizada, então ressincroniza.
      if (error instanceof ApiError && (error.status === 409 || error.status === 404)) {
        await refresh();
      }
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <section className="card" aria-busy={screen.status === 'loading' || busy}>
        {screen.status === 'loading' && (
          <div className="state" role="status">
            <span className="spinner" aria-hidden="true" />
            <p>Carregando criadora…</p>
          </div>
        )}

        {screen.status === 'error' && (
          <div className="state">
            <p className="alert" role="alert">
              {screen.message}
            </p>
            <button type="button" className="button button--secondary" onClick={() => setReloadKey((k) => k + 1)}>
              Tentar novamente
            </button>
          </div>
        )}

        {screen.status === 'ready' && (
          <>
            <div className="avatar" aria-hidden="true">
              {screen.creator.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="name">{screen.creator.name}</h1>
            <p className="followers" aria-live="polite">
              {formatFollowers(screen.creator.followersCount)}
            </p>

            <button
              type="button"
              className={`button ${screen.creator.isFollowing ? 'button--secondary' : 'button--primary'}`}
              onClick={handleToggleFollow}
              disabled={busy}
            >
              {busy ? 'Aguarde…' : screen.creator.isFollowing ? 'Deixar de seguir' : 'Seguir'}
            </button>

            {actionError && (
              <p className="alert" role="alert">
                {actionError}
              </p>
            )}
          </>
        )}
      </section>

      <p className="footnote">
        Usuário de demonstração: <code>{DEMO_USER_ID}</code>
      </p>
    </main>
  );
}
