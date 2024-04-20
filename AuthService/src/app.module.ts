import { Module } from '@nestjs/common';
import { TokenModule } from './modules/token/token.module';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [TokenModule, UserModule],

})
export class AppModule {}
