import { Module} from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Token } from './entities/token.entity';


@Module({
  imports: [
    ConfigModule.forRoot({envFilePath:join(__dirname,'.env')}),
    TypeOrmModule.forRoot({
      type:"postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Role, Token],
      synchronize: true,
    }),
    UserModule
  ]

})
export class AppModule {}
