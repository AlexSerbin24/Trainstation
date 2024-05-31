import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Train } from './train.entity';
import { Station } from './station.entity';

@Entity()
export class RouteSegment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "trainId" })
    trainId: number;

    @ManyToOne(() => Train, train => train.routeSegments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "trainId" })
    train: Train;

    @Column({ name: "stationId" })
    stationId: number;

    @ManyToOne(() => Station)
    @JoinColumn({ name: "stationId" })
    station: Station;

    @Column({ type: 'timestamp without time zone', nullable: true })
    departureTime: Date | null;

    @Column({ type: 'timestamp without time zone', nullable: true })
    arrivalTime: Date | null;
}
