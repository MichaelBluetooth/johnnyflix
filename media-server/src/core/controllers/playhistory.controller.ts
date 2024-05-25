import { Body, Controller, Delete, Get, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { PlayHistoryService } from '../services/play-history/play-history.service';
import { UpdatePlayHistoryRequest } from '../dto/update-play-history.dto';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/playhistory')
export class PlayHistoryController {
    private readonly logger = new Logger(PlayHistoryController.name);

    constructor(private playHistoryService: PlayHistoryService) { }

    @Get()
    listPlayHistory() {
        return this.playHistoryService.getPlayHistory();
    }

    @Post()
    updatePlayHistory(@Body() data: UpdatePlayHistoryRequest) {
        this.playHistoryService.updatePlayHistory(data.mediaId, data.lastPosition);
        return {};
    }

    @Delete(':mediaId')
    clearPlayHistory(@Param('mediaId') mediaId: number) {
        this.playHistoryService.clearPlayHistory(+mediaId);
        return {};
    }
}
