import { Media } from "./media.model";

export interface Library {
    id: number;
    name: string;
    media: Media[];
}