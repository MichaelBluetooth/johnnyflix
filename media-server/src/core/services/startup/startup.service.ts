import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs\\common';
import { LibraryService } from '..\\library\\library.service';
import { MediaService } from '..\\media\\media.service';
import { Library } from 'src\\core\\entities\\library.entity';
import { TranscoderService } from '..\\transcoder\\transcoder.service';
import { PlayHistoryService } from '..\\play-history\\play-history.service';
import { FindMediaService } from '..\\find-media\\find-media.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class StartupService implements OnApplicationBootstrap {
    private readonly logger = new Logger(StartupService.name);

    constructor(
        private librarySvc: LibraryService,
        private mediaSvc: MediaService,
        private jobSvc: TranscoderService,
        private playHistory: PlayHistoryService,
        private findMediaSvc: FindMediaService,
        private settings: SettingsService) { }

    async onApplicationBootstrap() {               
        this.logger.debug('BOOSTRAPPING APP');
        this.settings.readSettings();
        //await this.readConfigFile();
        await this.seedTestData();                
    }    

    async readConfigFile() {
        const existingLibraries = await this.librarySvc.getLibraries();
        for (const libDetail of this.settings.defaultLibraries) {
            const existingLibrary = existingLibraries.find(lib => lib.name === libDetail.name);
            if (existingLibrary) {
                this.logger.debug(`Library with name ${existingLibrary.name} already exists`);
                //For the existing library, add any directories that are in the config file, but not in the db
                for (const configDir of libDetail.directories) {
                    const dirAlreadyExistsInLibrary = existingLibrary.directories.map(d => d.path).indexOf(configDir) > -1;
                    if (!dirAlreadyExistsInLibrary) {
                        this.logger.debug(`Adding directory [${configDir}] to library`);
                        this.librarySvc.addLibraryDirectory(existingLibrary.id, configDir);
                    }
                }

                //For the existing library, remove any directories that are in the db but not in the config file
                for (const existingDir of existingLibrary.directories) {
                    const dirInConfigFile = libDetail.directories.indexOf(existingDir.path) > -1;
                    if (!dirInConfigFile) {
                        this.logger.debug(`Removing directory [${existingDir.path}] from library`);
                        this.librarySvc.deleteLibraryDirectory(existingDir.id);
                    }
                }
            } else {
                this.logger.debug(`Creating library: ${libDetail.name}`);
                await this.librarySvc.createLibrary({
                    name: libDetail.name,
                    directories: libDetail.directories
                });
            }
        }
    }

    async seedTestData() {
        this.deleteTestData();
        this.jobSvc.clearAllJobs();
        this.findMediaSvc.clearAllJobs();

        const library: Library = await this.librarySvc.createLibrary({
            name: 'Movies',
            directories: [
                'C:\\Users\\matth\\workspace\\media-app\\media_server_test_data\\movies'
            ]
        });

        const parrotMedia = await this.createTestMedia(
            library.id,
            'Wings of Friendship',
            'parrot.mkv',
            'C:\\Users\\matth\\workspace\\media-app\\media_server_test_data\\movies\\PARROT',
            ['Happy', 'Colorful', 'Bird'],
            "A vibrant Scarlett Macaw embarks on a colorful journey to find her flock after getting separated. Along the way, she encounters an array of characters - from wise old owls to playful rabbits and jazz-loving cats. Amidst the challenges, she learns valuable lessons about trust, loyalty, and the true meaning of friendship. As she navigates through the exotic landscapes, even forming an unlikely bond with a gentle crocodile, the Scarlett Macaw discovers that friendship knows no bounds, transcending species and stereotypes. Will she reunite with her flock, or will her newfound friends become her true family?",
            2025,
            27000,
            "parrot.png"
        );
        this.playHistory.updatePlayHistory(parrotMedia.id, 5);

        const dredd1995Media = await this.createTestMedia(
            library.id,
            'Judge Dredd (1995)',
            'Judge.Dredd.1995.mkv',
            'C:\\Users\\matth\\workspace\\media-app\\media_server_test_data\\movies\\Judge.Dredd.1995',
            ['Science Fiction', 'Action', 'Crime', 'Thriller'],
            "In a dystopian future, Joseph Dredd, the most famous Judge (a police officer with instant field judiciary powers), is convicted for a crime he did not commit and must face his murderous counterpart.",
            1995,
            5760000,
            "dredd.png"
        );
        this.playHistory.updatePlayHistory(dredd1995Media.id, 3582);

        await this.createTestMedia(
            library.id,
            'Judge Dredd (2012)',
            'Dredd.2012.1080p.BluRay.x264.mp4',
            'C:\\Users\\matth\\workspace\\media-app\\media_server_test_data\\movies\\Dredd.2012',
            ['Action', 'Science Fiction', 'Crime'],
            "In a violent, futuristic city where the police have the authority to act as judge, jury and executioner, a cop teams with a trainee to take down a gang that deals the reality-altering drug, SLO-MO.",
            2012,
            5700000,
            "dredd.png"
        );
        await this.createTestMedia(
            library.id,
            'Starhip Troopers 2: Hero of the Federation',
            'Starship.Troopers.2.Hero.Of.The.Federation.2004.1080p.BluRay.x265.mp4',
            'C:\\Users\\matth\\workspace\\media-app\\media_server_test_data\\movies\\Starship.Troopers.2.Hero.Of.The.Federation.2004',
            ['Action', 'Adventure', 'Thriller', 'Science Fiction'],
            "In this sequel, we're sent back to the battlefield, as the Federation's best mobile infantry unit's are slowly being overpowered by the killer bugs. They're light years from the nearest reinforcements and are trapped on a remote outpost. Though they've set up protection around the post, the enemy's in the outpost, in a way which they never thought of.",
            2004,
            5460000,                        
            "Starship.Troopers.2.png"
        );
        await this.createTestMedia(
            library.id,
            'Starship Troopers',
            'Starship.Troopers.1997.1080p.BluRay.x264.mp4',
            'C:\\Users\\matth\\workspace\\media-app\\media_server_test_data\\movies\\Starship.Troopers.1997',
            ['Action', 'Adventure', 'Thriller', 'Science Fiction'],
            "Set in the future, the story follows a young soldier named Johnny Rico and his exploits in the Mobile Infantry. Rico's military career progresses from recruit to non-commissioned officer and finally to officer against the backdrop of an interstellar war between mankind and an arachnoid species known as \"the Bugs\".",
            1997,
            7740000,
            "startship.troopers.1997.png"
        );
        await this.createTestMedia(
            library.id,
            'The Running Man',
            'The.Running.Man.1987.mkv',
            'C:\\Users\\matth\\workspace\\media-app\\media_server_test_data\\movies\\The.Running.Man.1987',
            ['Action', 'Crime', 'Thriller', 'Science Fiction'],
            "A parody within an action thriller. Ben Richards is an innocent man who is sentenced to the Running Man game show, a futuristic audience participation capital punishment television show. While Ben is running from champions with chainsaws and sharpened hockey sticks, the host is busy with calls to the network about ratings.",
            1987,
            6000000,
            "the.running.man.1987.png"
        );
        this.logger.debug('Test Data Created');
    }

    async createTestMedia(
        libraryId: number,
        name: string,
        fileName: string,
        path: string,
        tags: string[],
        description: string,
        releaseYear: number,
        duration: number,
        poster: string) {
        return await this.mediaSvc.associateMedia({
            libraryId: libraryId,
            name: name,
            fileName: fileName,
            filePath: path,
            tags: tags,
            description: description,
            releaseYear: releaseYear,
            duration: duration,
            posterFileName: poster
        });
    }

    async deleteTestData() {
        const libraries = await this.librarySvc.getLibraries();
        for (const library of libraries) {
            const mediaList = await this.mediaSvc.getMediaByLibraryId(library.id);
            for (const media of mediaList) {
                await this.mediaSvc.deleteMedia(media);
            }

            this.librarySvc.deleteLibrary(library);
        }
    }
}
