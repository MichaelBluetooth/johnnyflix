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
import { ImageController } from './controllers/image.controller';
import { HomeController } from './controllers/home.controller';
import { User } from './entities/user.entity';
import { UserService } from './services/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  exports: [
    TypeOrmModule,
    JwtModule,
    UserService
  ],
  imports: [
    TypeOrmModule.forFeature([Library, LibraryDirectory, Media, PlayHistory, User]),
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
    }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('jwt.secret'),
          signOptions: {
            expiresIn: config.get<string | number>('jwt.expiration_time'),
          }
        };
      },
      inject: [ConfigService],
    }),
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
    UserService
  ],
  controllers: [
    VideoController,
    LibraryController,
    MediaController,
    JobController,
    PlayHistoryController,
    ImageController,
    HomeController
  ],
})
export class CoreModule { }
