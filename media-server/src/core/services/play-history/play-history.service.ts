import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayHistory } from 'src/core/entities/play-history.entity';
import { Repository } from 'typeorm';
import { MediaService } from '../media/media.service';

@Injectable()
export class PlayHistoryService {
    private readonly logger = new Logger(PlayHistoryService.name);

    constructor(
        @InjectRepository(PlayHistory) private playHistoryRepo: Repository<PlayHistory>,
        private mediaSvc: MediaService
    ) { }

    async updatePlayHistory(mediaId: number, position: number) {
        let history: PlayHistory = await this.playHistoryRepo.findOneBy({ mediaId: mediaId });
        if (!history) {
            history = new PlayHistory();
            history.mediaId = mediaId;
        }
        history.lastPlayed = new Date();
        history.position = Math.ceil(position);
        this.logger.debug(`Updating play history for media [${mediaId}] with position [${history.position}]`);
        this.playHistoryRepo.save(history);
    }

    async clearPlayHistory(mediaId: number) {
        const history: PlayHistory = await this.playHistoryRepo.findOneBy({ mediaId: mediaId });
        return this.playHistoryRepo.remove(history);
    }

    async getPlayHistory() {
        const history = await this.playHistoryRepo.createQueryBuilder('ph')
            .leftJoinAndSelect('ph.media', 'm')
            .take(10)
            .getMany();

        const dto = [];
        history.forEach((ph: PlayHistory) => {
            this.logger.debug(`Found play history for ${ph.media} at position ${ph.position}`);
            const mediaDto: any = this.mediaSvc.mediaToDto(ph.media);
            mediaDto.lastPlayed = ph.lastPlayed;
            mediaDto.lastPosition = ph.position;
            dto.push(mediaDto);
        });
        this.logger.debug(`Found ${dto.length} items`);
        return dto;
    }
}
