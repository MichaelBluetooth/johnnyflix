import { Column, Entity, ManyToOne } from "typeorm";
import { DefaultEntity } from "./default.entity";
import { Media } from "./media.entity";
import { ColumnNumericTransformer } from "../transformers/column-numeric.transformer";

@Entity()
export class PlayHistory extends DefaultEntity {
    @Column({ type: 'timestamptz', nullable: false })
    lastPlayed: Date;

    @Column({ nullable: false })
    mediaId: number;

    @ManyToOne(() => Media, (media) => media.playHistory, { nullable: false, onDelete: 'CASCADE' })
    media: Media;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, transformer: new ColumnNumericTransformer() })
    position: number;
}