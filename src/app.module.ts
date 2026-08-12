import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { IdentityModule } from './identity/identity.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [PrismaModule, IdentityModule, IntegrationsModule, EventsModule, TicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
