import { IsNotEmpty, IsString } from 'class-validator';
import { UserIdDto } from './user-id.dto';

/** Params do DELETE /creators/:creatorId/followers/:userId */
export class UnfollowParamsDto extends UserIdDto {
  @IsString()
  @IsNotEmpty()
  creatorId: string;
}
