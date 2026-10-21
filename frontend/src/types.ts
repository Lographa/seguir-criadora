/** Resposta de GET /creators/:id?userId=... */
export interface Creator {
  id: string;
  name: string;
  followersCount: number;
  isFollowing: boolean;
}
