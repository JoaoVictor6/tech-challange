import { IsNotEmpty, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty({ message: "O campo \"Nome\" é obrigatório" })
  name: string;

  @IsString()
  @IsNotEmpty({ message: "O campo \"Descrição\" é obrigatório" })
  description: string;

  @IsString()
  @IsNotEmpty({ message: "O campo \"Imagem\" é obrigatório" })
  imageUrl: string;
}
