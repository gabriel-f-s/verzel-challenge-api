import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExternalSource } from '../domain/enums/external-source.enum';
import { Type } from '../domain/enums/type.enum';

export class ImportEventDto {
  @ApiProperty({
    example: '414906',
    description: 'ID identificador na API externa (ex: ID do filme no TMDB)',
  })
  @IsString()
  @IsNotEmpty()
  externalId!: string;

  @ApiProperty({
    enum: ExternalSource,
    example: ExternalSource.TMDB,
    description: 'Origem da API externa',
  })
  @IsEnum(ExternalSource)
  @IsNotEmpty()
  source!: ExternalSource;

  @ApiProperty({
    example: 'Cinemark Sala 03 - Shopping SP Market',
    description: 'Local definido pelo organizador para a exibição/evento',
  })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({
    example: '2026-10-20T20:00:00Z',
    description: 'Data e hora da sessão/evento no formato ISO8601',
  })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiPropertyOptional({
    enum: Type,
    example: Type.SEATED,
    description: 'Tipo do evento (SEATED ou GENERAL)',
  })
  @IsEnum(Type)
  @IsOptional()
  type?: Type;

  @ApiProperty({
    example: 120,
    description:
      'Capacidade máxima de pessoas/assentos definida pelo organizador',
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  capacity!: number;

  @ApiProperty({
    example: 35.0,
    description: 'Preço do ingresso definido pelo organizador',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price!: number;
}
