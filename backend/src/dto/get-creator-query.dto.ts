import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { trimString, USER_ID_MAX_LENGTH } from './user-id.dto';

/** Query do GET /creators/:creatorId — o userId é opcional. */
export class GetCreatorQueryDto {
  @IsOptional()
  @Transform(trimString)
  @IsString({ message: 'userId deve ser um texto' })
  @IsNotEmpty({ message: 'userId não pode ser vazio' })
  @MaxLength(USER_ID_MAX_LENGTH, {
    message: `userId deve ter no máximo ${USER_ID_MAX_LENGTH} caracteres`,
  })
  userId?: string;
}
