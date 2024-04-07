import { PrimaryGeneratedColumn } from "typeorm";

export abstract class DefaultEntity {
    @PrimaryGeneratedColumn()
    id: number;
}