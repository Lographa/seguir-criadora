import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { Creator } from '../src/entities/creator.entity';
import { createTestApp } from './create-test-app';

const CREATOR_ID = 'creator-1';
const followersUrl = (creatorId = CREATOR_ID) => `/creators/${creatorId}/followers`;

describe('API de seguidores (e2e)', () => {
  let app: INestApplication;
  let http: ReturnType<typeof request>;

  // Uma aplicação (e um banco em memória) novo para CADA teste.
  beforeEach(async () => {
    app = await createTestApp();
    http = request(app.getHttpServer());
  });

  afterEach(async () => {
    await app.close();
  });

  const follow = (userId: string, creatorId = CREATOR_ID) =>
    http.post(followersUrl(creatorId)).send({ userId });
  const unfollow = (userId: string, creatorId = CREATOR_ID) =>
    http.delete(`${followersUrl(creatorId)}/${encodeURIComponent(userId)}`);
  const count = async (creatorId = CREATOR_ID) =>
    (await http.get(`${followersUrl(creatorId)}/count`)).body.followersCount;

  describe('ambiente de teste', () => {
    it('usa SQLite em memória, e não o banco de desenvolvimento', () => {
      const dataSource = app.get(DataSource);
      expect(dataSource.options.type).toBe('better-sqlite3');
      expect(dataSource.options.database).toBe(':memory:');
    });

    it('cadastra a criadora inicial "Ana Criadora" uma única vez', async () => {
      const creators = await app.get(DataSource).getRepository(Creator).find();
      expect(creators).toEqual([{ id: CREATOR_ID, name: 'Ana Criadora' }]);

      const res = await http.get(`/creators/${CREATOR_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Ana Criadora');
    });

    // Os dois testes abaixo rodam em sequência: o primeiro deixa um seguidor,
    // o segundo prova que esse dado não vazou para ele.
    it('isolamento (1/2): cria um seguidor', async () => {
      await follow('user-vazamento').expect(201);
      expect(await count()).toBe(1);
    });

    it('isolamento (2/2): não enxerga o seguidor do teste anterior', async () => {
      expect(await count()).toBe(0);
      const res = await http.get(`/creators/${CREATOR_ID}`).query({ userId: 'user-vazamento' });
      expect(res.body.isFollowing).toBe(false);
    });
  });

  describe('POST /creators/:creatorId/followers (seguir)', () => {
    it('segue a criadora e responde 201 com os dados do relacionamento', async () => {
      const res = await follow('user-1');

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        creatorId: CREATOR_ID,
        userId: 'user-1',
        createdAt: expect.any(String),
      });
      expect(Number.isNaN(Date.parse(res.body.createdAt))).toBe(false);
    });

    it('responde 409 ao tentar seguir a mesma criadora duas vezes', async () => {
      await follow('user-1').expect(201);
      const res = await follow('user-1');

      expect(res.status).toBe(409);
      expect(res.body.statusCode).toBe(409);
    });

    it('a segunda tentativa de seguir não altera a contagem', async () => {
      await follow('user-1').expect(201);
      await follow('user-1').expect(409);

      expect(await count()).toBe(1);
    });

    it('considera o mesmo usuário mesmo com espaços nas pontas (trim)', async () => {
      await follow('user-1').expect(201);
      await follow('  user-1  ').expect(409);

      expect(await count()).toBe(1);
    });

    it('permite que usuários diferentes sigam a mesma criadora', async () => {
      await follow('user-1').expect(201);
      await follow('user-2').expect(201);

      expect(await count()).toBe(2);
    });

    it('responde 404 ao seguir uma criadora inexistente', async () => {
      const res = await follow('user-1', 'creator-inexistente');

      expect(res.status).toBe(404);
      expect(res.body.statusCode).toBe(404);
    });

    it('aceita userId com exatamente 100 caracteres', async () => {
      await follow('a'.repeat(100)).expect(201);
    });

    describe('userId inválido (400)', () => {
      const invalidBodies: Array<[string, unknown]> = [
        ['ausente (body vazio)', {}],
        ['string vazia', { userId: '' }],
        ['somente espaços', { userId: '   ' }],
        ['null', { userId: null }],
        ['número', { userId: 123 }],
        ['booleano', { userId: true }],
        ['array', { userId: ['user-1'] }],
        ['objeto', { userId: { id: 'user-1' } }],
        ['com mais de 100 caracteres', { userId: 'a'.repeat(101) }],
        ['campo com outro nome', { user: 'user-1' }],
      ];

      it.each(invalidBodies)('rejeita userId %s', async (_label, body) => {
        const res = await http.post(followersUrl()).send(body as object);

        expect(res.status).toBe(400);
        expect(res.body.statusCode).toBe(400);
      });

      it('rejeita requisição sem body', async () => {
        await http.post(followersUrl()).expect(400);
      });

      it('rejeita JSON malformado', async () => {
        await http
          .post(followersUrl())
          .set('Content-Type', 'application/json')
          .send('{"userId": ')
          .expect(400);
      });

      it('não cria nenhum seguidor quando o userId é inválido', async () => {
        await http.post(followersUrl()).send({ userId: '   ' }).expect(400);
        await http.post(followersUrl()).send({ userId: 123 }).expect(400);

        expect(await count()).toBe(0);
      });

      it('valida o userId antes de checar a criadora (400, não 404)', async () => {
        await follow('', 'creator-inexistente').expect(400);
      });
    });
  });

  describe('DELETE /creators/:creatorId/followers/:userId (deixar de seguir)', () => {
    it('deixa de seguir e responde 204 sem corpo', async () => {
      await follow('user-1').expect(201);
      const res = await unfollow('user-1');

      expect(res.status).toBe(204);
      expect(res.text).toBe('');
    });

    it('atualiza contagem e isFollowing depois de deixar de seguir', async () => {
      await follow('user-1').expect(201);
      await unfollow('user-1').expect(204);

      expect(await count()).toBe(0);
      const res = await http.get(`/creators/${CREATOR_ID}`).query({ userId: 'user-1' });
      expect(res.body).toMatchObject({ followersCount: 0, isFollowing: false });
    });

    it('permite seguir novamente depois de deixar de seguir', async () => {
      await follow('user-1').expect(201);
      await unfollow('user-1').expect(204);
      await follow('user-1').expect(201);

      expect(await count()).toBe(1);
    });

    it('responde 404 ao deixar de seguir sem estar seguindo', async () => {
      const res = await unfollow('user-1');

      expect(res.status).toBe(404);
      expect(res.body.statusCode).toBe(404);
    });

    it('responde 404 na segunda tentativa de deixar de seguir', async () => {
      await follow('user-1').expect(201);
      await unfollow('user-1').expect(204);

      await unfollow('user-1').expect(404);
    });

    it('não remove o seguidor de outro usuário', async () => {
      await follow('user-1').expect(201);
      await follow('user-2').expect(201);

      await unfollow('user-1').expect(204);
      await unfollow('user-1').expect(404);

      expect(await count()).toBe(1);
      const res = await http.get(`/creators/${CREATOR_ID}`).query({ userId: 'user-2' });
      expect(res.body.isFollowing).toBe(true);
    });

    it('responde 404 ao deixar de seguir uma criadora inexistente', async () => {
      await unfollow('user-1', 'creator-inexistente').expect(404);
    });

    it('responde 400 quando o userId do path é só espaços', async () => {
      await http.delete(`${followersUrl()}/%20`).expect(400);
    });
  });

  describe('GET /creators/:creatorId/followers/count (contagem)', () => {
    it('retorna 0 quando ninguém segue', async () => {
      const res = await http.get(`${followersUrl()}/count`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ creatorId: CREATOR_ID, followersCount: 0 });
    });

    it('acompanha seguir, deixar de seguir e tentativas rejeitadas', async () => {
      expect(await count()).toBe(0);

      await follow('user-1').expect(201);
      expect(await count()).toBe(1);

      await follow('user-2').expect(201);
      await follow('user-3').expect(201);
      expect(await count()).toBe(3);

      await follow('user-2').expect(409); // duplicado: não conta
      await follow('').expect(400); // inválido: não conta
      expect(await count()).toBe(3);

      await unfollow('user-2').expect(204);
      expect(await count()).toBe(2);

      await unfollow('user-2').expect(404); // já removido: não decrementa
      expect(await count()).toBe(2);
    });

    it('responde 404 para criadora inexistente', async () => {
      await http.get(`${followersUrl('creator-inexistente')}/count`).expect(404);
    });
  });

  describe('GET /creators/:id (consulta da criadora)', () => {
    it('retorna nome, followersCount e isFollowing=false quando não há userId', async () => {
      const res = await http.get(`/creators/${CREATOR_ID}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: CREATOR_ID,
        name: 'Ana Criadora',
        followersCount: 0,
        isFollowing: false,
      });
    });

    it('isFollowing é true para quem segue e false para quem não segue', async () => {
      await follow('user-1').expect(201);

      const seguindo = await http.get(`/creators/${CREATOR_ID}`).query({ userId: 'user-1' });
      const naoSeguindo = await http.get(`/creators/${CREATOR_ID}`).query({ userId: 'user-2' });
      const semUserId = await http.get(`/creators/${CREATOR_ID}`);

      expect(seguindo.body).toMatchObject({ followersCount: 1, isFollowing: true });
      expect(naoSeguindo.body).toMatchObject({ followersCount: 1, isFollowing: false });
      expect(semUserId.body).toMatchObject({ followersCount: 1, isFollowing: false });
    });

    it('aplica trim no userId da query', async () => {
      await follow('user-1').expect(201);

      const res = await http.get(`/creators/${CREATOR_ID}`).query({ userId: '  user-1  ' });
      expect(res.body.isFollowing).toBe(true);
    });

    it('followersCount bate com o endpoint de contagem', async () => {
      await follow('user-1').expect(201);
      await follow('user-2').expect(201);

      const res = await http.get(`/creators/${CREATOR_ID}`);
      expect(res.body.followersCount).toBe(await count());
      expect(res.body.followersCount).toBe(2);
    });

    it('responde 400 quando userId é informado mas vazio', async () => {
      await http.get(`/creators/${CREATOR_ID}`).query({ userId: '' }).expect(400);
    });

    it('responde 404 para criadora inexistente', async () => {
      await http.get('/creators/creator-inexistente').expect(404);
    });
  });
});
