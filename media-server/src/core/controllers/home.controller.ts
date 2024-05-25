import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { MediaService } from '../services/media/media.service';
import { PlayHistoryService } from '../services/play-history/play-history.service';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/home')
export class HomeController {
    private readonly logger = new Logger(HomeController.name);

    constructor(private mediaSvc: MediaService, private playHistorySvc: PlayHistoryService) { }

    @Get()
    async listJobs(): Promise<any> {
        const recentlyAdded = await this.mediaSvc.getRecentlyAdded(10);
        const recentlyReleased = await this.mediaSvc.getRecentlyReleased(10);
        const continueWatching = await this.playHistorySvc.getPlayHistory();
        return {
            recentlyAdded, continueWatching, recentlyReleased
        }
    }
}
