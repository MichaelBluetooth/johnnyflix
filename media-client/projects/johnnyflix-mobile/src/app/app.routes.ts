import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { homeResolver, libraryMediaResolver, mediaResolver, jobsResolver } from 'jflix-components';
import { ViewMediaComponent } from './components/view-media/view-media.component';
import { ViewLibraryComponent } from './components/view-library/view-library.component';
import { VideoComponent } from './components/video/video.component';
import { JobsComponent } from './components/jobs/jobs.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            media: homeResolver
        }
    },
    {
        path: 'media/:id',
        component: ViewMediaComponent,
        resolve: {
            media: mediaResolver
        }
    },
    {
        path: 'library/:id',
        component: ViewLibraryComponent,
        resolve: {
            library: libraryMediaResolver
        }        
    },
    {
        path: 'watch/:id',
        component: VideoComponent,
        resolve: {
            media: mediaResolver
        }
    },
    {
        path: 'jobs',
        component: JobsComponent,
        resolve: {
            jobs: jobsResolver
        }
    }
];
