import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateTicketDto {
  @ApiProperty({
    example: 'd8c83a1a-4d76-47b2-8c85-6126e7a25ec2',
    description: 'ID do evento onde a portaria está operando',
  })
  @IsUUID('4', { message: 'eventId deve ser um UUID válido' })
  @IsNotEmpty({ message: 'eventId é obrigatório' })
  eventId!: string;

  @ApiProperty({
    example: '{"id":"...","eventId":"...","signature":"..."}',
    description: 'Payload lido do QR Code ou código/token digitado manualmente',
  })
  @IsString()
  @IsNotEmpty({ message: 'qrCodeData é obrigatório' })
  qrCodeData!: string;
}
