import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { DefaultEntity } from "./default.entity";
import { Library } from "./library.entity";
import { PlayHistory } from "./play-history.entity";

@Entity()
export class Media extends DefaultEntity {
    @Column({ type: 'varchar', length: 150, nullable: false })
    fileName: string;

    @Column({ type: 'varchar', length: 500, nullable: false })
    path: string;

    @Column({ type: 'varchar', length: 150, nullable: false })
    name: string;

    @Column({ nullable: false })
    libraryId: number;

    @ManyToOne(() => Library, (lib) => lib.media, { nullable: false })
    library: Library;

    
    @OneToMany(() => PlayHistory, (ph) => ph.media)
    playHistory: PlayHistory[];


    @Column({ type: 'text', array: true, nullable: true }) //todo: really need "text" as the type? Isn't that a slow DB column type?
    tags: string[];

    @Column({ type: 'varchar', length: 1000, nullable: true })
    description: string;

    @Column({ nullable: true })
    releaseYear: number;

    @Column({ nullable: true })
    duration: number;

    @Column({ type: 'varchar', length: 150, nullable: true })
    posterFileName: string;
}