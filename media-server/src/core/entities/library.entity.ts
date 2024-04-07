import { Column, Entity, OneToMany } from "typeorm";
import { LibraryDirectory } from "./library-directory.entity";
import { DefaultEntity } from "./default.entity";
import { Media } from "./media.entity";

@Entity()
export class Library extends DefaultEntity {
    @Column({ type: 'varchar', length: 250, nullable: false })
    name: string;

    @OneToMany(() => LibraryDirectory, (dir) => dir.library, { cascade: true })
    directories: LibraryDirectory[];

    @OneToMany(() => Media, (mc) => mc.library)
    media: Media[];
}