import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from '../domain/enums/type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    example: 'Show do Coldplay',
    description: 'Título principal do evento',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: 'Uma noite inesquecível...',
    description: 'Descrição detalhada',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://imagem.com/poster.jpg',
    description: 'URL do poster do evento',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: 'Allianz Parque',
    description: 'Local onde o evento ocorrerá',
  })
  location!: string;

  @ApiProperty({
    example: '2026-10-12T20:00:00Z',
    description: 'Data e hora do evento no formato ISO8601',
  })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiPropertyOptional({ enum: Type, description: 'Tipo do evento' })
  @IsEnum(Type)
  @IsOptional()
  type?: Type;

  @ApiProperty({ example: 50000, description: 'Capacidade máxima de pessoas' })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  capacity!: number;

  @ApiProperty({ example: 450.0, description: 'Preço do ingresso base' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price!: number;
}
