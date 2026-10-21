import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export const USER_ID_MAX_LENGTH = 100;

/** Remove espaços nas pontas; valores que não são string são preservados para a validação rejeitá-los. */
export const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Regras do userId, reaproveitadas em body, params e query. */
export class UserIdDto {
  @Transform(trimString)
  @IsString({ message: 'userId deve ser um texto' })
  @IsNotEmpty({ message: 'userId é obrigatório' })
  @MaxLength(USER_ID_MAX_LENGTH, {
    message: `userId deve ter no máximo ${USER_ID_MAX_LENGTH} caracteres`,
  })
  userId: string;
}
