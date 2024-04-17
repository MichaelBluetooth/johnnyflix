import { Routes } from '@angular/router';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { LibraryComponent } from './components/library/library.component';
import { libraryMediaResolver } from './resolvers/library-media.resolver';
import { MediaContainerComponent } from './components/media-container/media-container.component';
import { mediaResolver } from './resolvers/media.resolver';
import { JobsListComponent } from './components/jobs-list/jobs-list.component';
import { jobsResolver } from './resolvers/jobs.resolver';
import { HomeComponent } from './components/home/home.component';
import { homeResolver } from './resolvers/home.resolver';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
            media: homeResolver
        }
    },
    {
        path: 'media/:id',
        component: MediaContainerComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
            media: mediaResolver
        }
    },
    {
        path: 'watch/:id',
        component: VideoPlayerComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
            media: mediaResolver
        }
    },
    {
        path: 'library/:id',
        component: LibraryComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
            library: libraryMediaResolver
        }
    },
    {
        path: 'jobs',
        component: JobsListComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
            jobs: jobsResolver
        }
    }
];
