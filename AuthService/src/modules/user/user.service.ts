import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserLoginDto } from '../../dto/user-login.dto'
import { UserRegisterDto } from '../../dto/user-register.dto';
import { UserUpdateDataDto } from '../../dto/user-update.dto';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { TokenVerificationDto } from '../../dto/token-verification.dto';
import { Auth, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {
    const clientID = this.configService.get('CLIENT_ID');
    const clientSecret = this.configService.get('CLIENT_SECRET');


    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async googleAuth(tokenVerification: TokenVerificationDto) {
    const { token } = tokenVerification;

    const payload = (await this.oauthClient.verifyIdToken({ idToken: token })).getPayload();

    const { email, name, family_name: lastname } = payload;

    let user = await this.userRepository.findOne({ where: { email } });

    if (!user)

      user = await this.userRepository.save({
        name: name,
        lastname: lastname ?? "Unknown",
        patronymic: "Unknown",
        roleId:2,
        email
      });


    const accessToken = this.tokenService.generateAccessToken(user.id, user.email);
    const refreshToken = this.tokenService.generateRefreshToken(user.id, user.email);

    const savedRefreshToken = await this.tokenService.saveToken(user.id,  refreshToken);


    user.token = savedRefreshToken;

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
    };

  }


  async login(userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;

    // Находим пользователя в базе данных
    const user = await this.userRepository.findOne({ where: { email } });


    if (!user) {
      throw new BadRequestException('User with this email are not existed');
    }

    if (!user.passwordHash) {
      throw new BadRequestException('You were autrhorized by Google early. Please, sign in again via Google and add password in profile.');
    }

    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw new BadRequestException('Incorrect user password');
    }

    const accessToken = this.tokenService.generateAccessToken(user.id, user.email);
    const refreshToken = this.tokenService.generateRefreshToken(user.id, user.email);
    await this.tokenService.saveToken(user.id, refreshToken);

    return {
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }




  async register(userRegisterDto: UserRegisterDto) {
    const { name, lastname, patronymic, email, password } = userRegisterDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      lastname,
      patronymic,
      email,
      passwordHash,
    });

    const newUser = await this.userRepository.save(user);
    // { id, email: userEmail }
    const accessToken = this.tokenService.generateAccessToken(newUser.id, newUser.email);
    const refreshToken = this.tokenService.generateRefreshToken(newUser.id, newUser.email);

    const token = await this.tokenService.saveToken(newUser.id, refreshToken);

    newUser.token = token;
    await this.userRepository.save(newUser);

    return {
      id: newUser.id,
      userEmail: newUser.email,
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.deleteToken(refreshToken);
  }

  async updateProfile(userId: number, userData: UserUpdateDataDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }


    for (const key in userData) {
      if (key === 'password') {
        user.passwordHash = await bcrypt.hash(userData.password, 10);
      }
      else {
        user[key] = userData[key]
      }
    }

    return await this.userRepository.save(user);;
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Invalid token');

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const token = await this.tokenService.findTokenByRefreshToken(refreshToken);

    if (!userData || !token) {
      throw new UnauthorizedException('Invalid token');
    }

    const { userId } = token;

    const { id, email } = (await this.userRepository.findOne({ where: { id: userId } }));

    const newAccessToken = this.tokenService.generateAccessToken(id, email);
    const newRefreshToken = this.tokenService.generateRefreshToken(id, email);

    await this.tokenService.saveToken(id, newRefreshToken);

    return { id, email, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}

