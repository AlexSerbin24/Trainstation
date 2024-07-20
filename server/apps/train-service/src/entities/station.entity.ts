import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Station {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;
}
