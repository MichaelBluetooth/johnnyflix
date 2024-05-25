import { Column, Entity } from "typeorm";
import { DefaultEntity } from "./default.entity";

@Entity()
export class User extends DefaultEntity {
    @Column({ type: 'varchar', length: 250, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 250, nullable: false })
    password: string;

    @Column({ type: 'timestamptz', nullable: true })
    lastLogin: Date;
}