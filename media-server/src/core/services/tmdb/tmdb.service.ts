import { Injectable, Logger } from '@nestjs/common';
import { TMDBSearchResponse } from './tmdb-search-response';
import { join } from 'path';
import { TMDBGenre } from 'src/core/dto/tmdb-genre.dto';

@Injectable()
export class TMDBService {
    private readonly logger = new Logger(TMDBService.name);

    async findBestMatch(fileName: string): Promise<TMDBSearchResponse> {
        this.logger.debug(`Finding best match for '${fileName}'`);
        const { title, year } = this.getTitleAndYearFromFileName(fileName);

        const qs = [
            `query=${title}`
        ];
        if (year) {
            qs.push(`year=${year}`);
        }
        const url = `https://api.themoviedb.org/3/search/movie?${qs.join('&')}`;
        this.logger.debug(`Querying TMDB: ${url}`);
        const resp = await this.get<TMDBSearchResponse>(url, 'json');
        this.logger.debug(`Got response: ${JSON.stringify(resp)}`);
        return resp;
    }

    getTitleAndYearFromFileName(fileName: string) {
        //EXAMPLE: Total.Recall_2023_EXTENDED.720p.BrRip.x264.mp4
        const parts = fileName.split('_');
        return {
            title: parts[0].split('.').join(' '),
            year: parts.length > 1 ? parts[1] : null
        };
    }

    getPoster(path: string): Promise<Blob> {
        const posterPath = join('https://image.tmdb.org/t/p/original', path);
        this.logger.debug(`Getting poster from: ${posterPath}`);
        return this.get(posterPath, 'blob');
    }

    getMovieGenres(): Promise<{ genres: TMDBGenre[] }> {
        return this.get('https://api.themoviedb.org/3/genre/movie/list?language=en', 'json');
    }

    async get<T>(url: string, responseType: 'json' | 'blob' | 'buffer' = null): Promise<T> {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMmU1NGNkNGQwNWJjMTllOGQ2NGE0NjdlOGQzZTYyYSIsInN1YiI6IjY1OTA0NjU0Y2U0ZGRjNmNkMzdkOGMxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lW0dNN-4IpnJSzBX58CwTayEq77e5_R9wRLo2mNUtv0'
            }
        };
        return await fetch(url, options).then(res => {
            if (responseType === 'json') {
                return res.json();
            } else if (responseType === 'blob') {
                return res.blob();
            } else if (responseType === 'buffer') {
                return res.arrayBuffer();
            } else {
                return res;
            }
        });
    }
}
