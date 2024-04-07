import ffmpeg from 'fluent-ffmpeg';
import { existsSync, mkdirSync, writeFileSync } from "fs";

const fileName = 'Judge.Dredd.1995.mkv';
const file = `C:/Users/matth/workspace/media-app/media_server_test_data/movies/Judge.Dredd.1995/${fileName}`;
const outputDir = 'C:/Users/matth/workspace/media-app/media_server_test_data/movies/Judge.Dredd.1995/hls';

if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
}

const resolutions = [
    {
        resolution: '320x180',
        videoBitrate: '500k',
        audioBitrate: '64k'
    },
    // {
    //     resolution: '854x480',
    //     videoBitrate: '1000k',
    //     audioBitrate: '128k'
    // },
    // {
    //     resolution: '1280x720',
    //     videoBitrate: '2500k',
    //     audioBitrate: '192k'
    // }
];

const variantPlaylists = [];
for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
    // const outputFileName = `${fileName.replace(
    //     '.',
    //     '_'
    // )}_${resolution}.m3u8`;    
    // const segmentFileName = `${fileName.replace(
    //     '.',
    //     '_'
    // )}_${resolution}_%03d.ts`;
    const outputFileName = `${fileName}_${resolution}.m3u8`;
    const segmentFileName = `${fileName}_${resolution}_%03d.ts`;

    await new Promise((resolve, reject) => {
        ffmpeg(file)
            .outputOptions([
                `-c:v h264`,
                `-b:v ${videoBitrate}`,
                `-c:a aac`,
                `-b:a ${audioBitrate}`,
                `-vf scale=${resolution}`,
                `-f hls`,
                `-hls_time 10`,
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
            return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}/n${outputFileName}`;
        })
        .join('/n');
    masterPlaylist = `#EXTM3U/n` + masterPlaylist;

    const masterPlaylistFileName = `${fileName.replace(
        '.',
        '_'
    )}_master.m3u8`;
    const masterPlaylistPath = `${outputDir}/${masterPlaylistFileName}`;
    writeFileSync(masterPlaylistPath, masterPlaylist);
}
