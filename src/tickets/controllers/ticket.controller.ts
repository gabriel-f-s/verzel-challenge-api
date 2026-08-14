import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { TicketService } from '../services/ticket.service';
import { PurchaseTicketDto } from '../dto/purchase-ticket.dto';
import { ValidateTicketDto } from '../dto/validate-ticket.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('purchase')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Compra / Reserva de ingresso com pagamento simulado',
    description:
      'Permite ao cliente reservar seu assento e simular o pagamento (aprovado ou recusado). Gera o QR Code anti-fraude.',
  })
  @ApiResponse({
    status: 201,
    description: 'Ingresso adquirido com sucesso!',
  })
  @ApiResponse({
    status: 400,
    description:
      'Evento esgotado, assento não informado ou pagamento recusado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Assento já ocupado por outro cliente.',
  })
  @UseGuards(RolesGuard)
  @Roles('CLIENTE')
  async purchaseTicket(
    @Body() dto: PurchaseTicketDto,
    @CurrentUser('id') clientId: string,
  ) {
    return this.ticketService.purchaseTicket(dto, clientId);
  }

  @Get('my-tickets')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lista os ingressos do cliente logado',
    description:
      'Retorna todos os ingressos adquiridos pelo cliente com os payloads de QR Code e tokens de compartilhamento.',
  })
  @UseGuards(RolesGuard)
  @Roles('CLIENTE')
  async getMyTickets(@CurrentUser('id') clientId: string) {
    return this.ticketService.getMyTickets(clientId);
  }

  @Public()
  @Get('event/:eventId/occupied-seats')
  @ApiOperation({
    summary: 'Lista os assentos já ocupados de um evento',
    description:
      'Utilizado para alimentar o mapa interativo de assentos no Front-End.',
  })
  @ApiParam({ name: 'eventId', description: 'ID do evento' })
  async getOccupiedSeats(@Param('eventId') eventId: string) {
    return this.ticketService.getOccupiedSeats(eventId);
  }

  @Public()
  @Get('share/:token')
  @ApiOperation({
    summary: 'Visualização pública de um ingresso compartilhado por link',
    description:
      'Permite acessar os dados do ingresso compartilhado sem necessidade de login.',
  })
  @ApiParam({ name: 'token', description: 'Token público do ingresso' })
  async getByShareToken(@Param('token') shareToken: string) {
    return this.ticketService.getByShareToken(shareToken);
  }

  @Post('validate')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Validação de ingresso na Portaria',
    description:
      'Valida o QR Code lido pela câmera ou código digitado. Retorna se é VÁLIDO, JÁ UTILIZADO, EVENTO ERRADO ou INVÁLIDO.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado da validação com status e mensagem clara.',
  })
  @UseGuards(RolesGuard)
  @Roles('PORTARIA')
  async validateTicket(
    @Body() dto: ValidateTicketDto,
    @CurrentUser('id') validatorUserId: string,
  ) {
    return this.ticketService.validateTicket(dto, validatorUserId);
  }
}
