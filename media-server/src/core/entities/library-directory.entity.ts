import { Column, Entity, ManyToOne } from "typeorm";
import { Library } from "./library.entity";
import { DefaultEntity } from "./default.entity";

@Entity()
export class LibraryDirectory extends DefaultEntity {
    @Column({ type: 'varchar', length: 500, nullable: false })
    path: string;

    @Column({ nullable: false })
    libraryId: number;

    @ManyToOne(() => Library, (lib) => lib.directories, { nullable: false, onDelete: 'CASCADE' })
    library: Library;    
}