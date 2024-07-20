import { MigrationInterface, QueryRunner } from "typeorm";
import { Station } from "../entities/station.entity";

export class Initial1721268911095 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(
            queryRunner.manager.create(Station, [
                { name: 'Київ' },
                { name: 'Харків' },
                { name: 'Одеса' },
                { name: 'Львів' },
                { name: 'Дніпро' },
                { name: 'Запоріжжя' },
                { name: 'Вінниця' },
                { name: 'Полтава' },
                { name: "Донецьк" },
                { name: 'Чернігів' },
                { name: 'Суми' },
                { name: 'Житомир' },
                { name: 'Івано-Франківськ' },
                { name: 'Тернопіль' },
                { name: 'Чернівці' },
                { name: 'Херсон' },
                { name: 'Миколаїв' },
                { name: 'Черкаси' },
                { name: 'Рівне' },
                { name: 'Луцьк' },
                { name: 'Ужгород' },
                { name: 'Хмельницький' },
                { name: 'Кропивницький' },
                { name: 'Маріуполь' }
            ])
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(Station, {});
    }

}
