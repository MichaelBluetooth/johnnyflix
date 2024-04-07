import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoController } from './controllers/video.controller';
import { Library } from './entities/library.entity';
import { LibraryDirectory } from './entities/library-directory.entity';
import { Media } from './entities/media.entity';
import { StartupService } from './services/startup/startup.service';
import { StreamService } from './services/stream/stream.service';
import { LibraryService } from './services/library/library.service';
import { MediaService } from './services/media/media.service';
import { LibraryController } from './controllers/library.controller';
import { MediaController } from './controllers/media.controller';
import { TranscoderService } from './services/transcoder/transcoder.service';
import { BullModule } from '@nestjs/bull';
import { JobController } from './controllers/job.controller';
import { PlayHistory } from './entities/play-history.entity';
import { PlayHistoryService } from './services/play-history/play-history.service';
import { PlayHistoryController } from './controllers/playhistory.controller';
import { FindMediaService } from './services/find-media/find-media.service';
import { FindMediaConsumer } from './consumers/find-media.consumer';
import { TranscoderConsumer } from './consumers/transcoder.consumer';
import { TMDBService } from './services/tmdb/tmdb.service';
import { SettingsService } from './services/settings/settings.service';
import { ImageController } from './controllers/image.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Library, LibraryDirectory, Media, PlayHistory]),
    BullModule.registerQueue({
      name: 'transcode',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'find-media',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    })
  ],
  providers: [
    StartupService,
    LibraryService,
    StreamService,
    MediaService,
    TranscoderService,
    PlayHistoryService,
    FindMediaService,
    TranscoderConsumer,
    FindMediaConsumer,
    TMDBService,
    SettingsService
  ],
  controllers: [
    VideoController,
    LibraryController,
    MediaController,
    JobController,
    PlayHistoryController,
    ImageController
  ],
})
export class CoreModule { }
