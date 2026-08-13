import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { EventType, ExternalSource } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsEnum(EventType)
  @IsOptional()
  type?: EventType;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  capacity!: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price!: number;
}
