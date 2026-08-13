import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './services/integrations.service';
import { TmdbProvider } from './providers/tmdb.provider';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [HttpModule, EventsModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, TmdbProvider],
})
export class IntegrationsModule {}
