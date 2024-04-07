import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import ffmpeg from 'fluent-ffmpeg';
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { HlsVersion } from '../utils/hls-utils';

@Processor('transcode')
export class TranscoderConsumer {
    //docker run -d -p 6379:6379 --name local-redis  redis
    private readonly logger = new Logger(TranscoderConsumer.name);

    @Process()
    async process(job: Job<any>) {
        this.logger.debug(`Transcoding (${job.id}): ${job.data.filePath}/${job.data.fileName}`);
        await this.transcode(job, job.data.fileName, job.data.filePath, job.data.hlsDetail);
    }

    // @OnQueueActive()
    // onActive(job: Job) {
    //     this.logger.debug(
    //         `Starting job ${job.id} of type ${job.name} with data ${job.data.fileName}...`,
    //     );
    // }

    @OnQueueCompleted()
    onCompleted(job: Job) {
        this.logger.debug(
            `Finished job ${job.id} of type ${job.name} with data ${job.data.fileName}...`,
        );
    }

    // @OnQueueError()
    // onError(job: Job) {
    //     this.logger.error(
    //         `Job errored!`,
    //     );
    // }


    async transcode(job: Job, fileName: string, filePath: string, hlsVersion: HlsVersion) {
        const file = `${filePath}/${fileName}`;
        const outputDir = `${filePath}/hls`;

        if (!existsSync(file)) {
            throw Error(`File does not exist: ${file}`);
        }

        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true });
        }

        try {
            // const resolutions = [
            //     {
            //         resolution: '320x180',
            //         videoBitrate: '500k',
            //         audioBitrate: '64k'
            //     },
            //     {
            //         resolution: '854x480',
            //         videoBitrate: '1000k',
            //         audioBitrate: '128k'
            //     },
            //     {
            //         resolution: '1280x720',
            //         videoBitrate: '2500k',
            //         audioBitrate: '192k'
            //     }
            // ];
            const resolutions = [hlsVersion];

            const variantPlaylists = [];
            for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
                const outputFileName = `${fileName}_${resolution}.m3u8`;
                const segmentFileName = `${fileName}_${resolution}_%03d.ts`;

                await new Promise<void>((resolve, reject) => {
                    ffmpeg(file)
                        .outputOptions([
                            `-c:v h264`,
                            `-b:v ${videoBitrate}`,
                            `-c:a aac`,
                            `-b:a ${audioBitrate}`,
                            `-vf scale=${resolution}`,
                            `-f hls`,         //the format? (format is "hls")
                            `-hls_time 10`,   //how long each segment is in seconds
                            `-hls_list_size 0`,
                            `-hls_segment_filename ${outputDir}/${segmentFileName}`
                        ])
                        .output(`${outputDir}/${outputFileName}`)
                        .on('end', () => resolve())
                        .on('error', (err) => {
                            reject(err);
                        })
                        .run();
                });

                const variantPlaylist = {
                    resolution,
                    outputFileName
                };
                variantPlaylists.push(variantPlaylist);

                let masterPlaylist = variantPlaylists
                    .map((variantPlaylist) => {
                        const { resolution, outputFileName } = variantPlaylist;
                        const bandwidth =
                            resolution === '320x180'
                                ? 676800
                                : resolution === '854x480'
                                    ? 1353600
                                    : 3230400;
                        return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}`;
                    })
                    .join('\n');
                masterPlaylist = `#EXTM3U\n` + masterPlaylist;

                const masterPlaylistFileName = `${fileName.replace(
                    '.',
                    '_'
                )}_master.m3u8`;
                const masterPlaylistPath = `${outputDir}/${masterPlaylistFileName}`;
                writeFileSync(masterPlaylistPath, masterPlaylist);
            }
        } catch (err) {
            this.logger.error(`Error transcoding ${file}`);
            throw err;
        }
    }
}