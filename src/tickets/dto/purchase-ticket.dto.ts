import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PurchaseTicketDto {
  @ApiProperty({
    example: 'd8c83a1a-4d76-47b2-8c85-6126e7a25ec2',
    description: 'ID único do evento',
  })
  @IsUUID('4', { message: 'eventId deve ser um UUID válido' })
  @IsNotEmpty({ message: 'eventId é obrigatório' })
  eventId!: string;

  @ApiPropertyOptional({
    example: 'A12',
    description:
      'Código do assento selecionado (obrigatório para eventos SEATED)',
  })
  @IsString()
  @IsOptional()
  seatNumber?: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description:
      'Flag para simular o resultado da transação de pagamento (true = Aprovado, false = Recusado)',
  })
  @IsBoolean()
  @IsOptional()
  simulatePaymentSuccess?: boolean = true;
}
