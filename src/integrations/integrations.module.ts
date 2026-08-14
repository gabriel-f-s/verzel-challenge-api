import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './services/integrations.service';
import { TmdbProvider } from './providers/tmdb.provider';

@Module({
  imports: [HttpModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, TmdbProvider],
  exports: [IntegrationsService, TmdbProvider],
})
export class IntegrationsModule {}
