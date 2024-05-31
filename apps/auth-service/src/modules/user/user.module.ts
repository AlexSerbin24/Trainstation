import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Token } from '../../entities/token.entity';
import { Role } from '../../entities/role.entity';
import { JwtStrategy } from '../../../../Trainstation/src/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token, Role]), JwtModule.register({})],
  providers: [UserService,TokenService,ConfigService, JwtStrategy],
  controllers: [UserController],
  

})
export class UserModule { }

