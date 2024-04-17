import { NgModule } from "@angular/core";
import { JflixHomeService } from "./home.service";
import { JflixLibraryService } from "./library.service";
import { JflixBaseUrlService } from "./base-url.service";
import { JflixMediaService } from "./media.service";
import { JflixPlayHistoryService } from "./play-history.service";
import { JflixJobService } from "./job.service";

@NgModule({
    providers: [
        JflixHomeService,
        JflixLibraryService,
        JflixBaseUrlService,
        JflixMediaService,
        JflixPlayHistoryService,
        JflixJobService
    ],
})
export class JflixServicesModule { }