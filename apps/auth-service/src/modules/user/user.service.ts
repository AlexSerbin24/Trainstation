import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserLoginDto, UserDto, TokenVerificationDto, UserRegisterDto, UserUpdateDataDto } from '@app/dtos';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { In } from "typeorm";
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
    // Initialize Google OAuth2 client
    const clientID = this.configService.get('CLIENT_ID');
    const clientSecret = this.configService.get('CLIENT_SECRET');
    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  /**
   * Authenticate user using Google OAuth2 token
   * @param tokenVerification - Object containing Google OAuth2 token
   * @returns Object containing access and refresh tokens
   */
  async googleAuth(tokenVerification: TokenVerificationDto) {
    const { token } = tokenVerification;
    // Verify Google OAuth2 token
    const payload = (await this.oauthClient.verifyIdToken({ idToken: token })).getPayload();
    const { email, name, family_name: lastname } = payload;

    // Check if user with the provided email exists
    let user = await this.userRepository.findOne({ where: { email } });

    // If user with the provided email doesn't exist, create a new user
    if (!user)
      user = await this.userRepository.save({
        name: name,
        lastname: lastname ?? "Unknown",
        patronymic: "Unknown",
        email
      });

    // Generate access and refresh tokens
    const accessToken = this.tokenService.generateAccessToken(user.id, user.email, user.roleId);
    const refreshToken = this.tokenService.generateRefreshToken(user.id, user.email, user.roleId);
    const savedRefreshToken = await this.tokenService.saveToken(user.id, refreshToken);

    // Save refresh token to the user
    user.token = savedRefreshToken;
    await this.userRepository.save(user);

    // Return user information and tokens
    return {
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticate user using email and password
   * @param userLoginDto - Object containing user email and password
   * @returns Object containing access and refresh tokens
   */
  async login(userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;

    // Find user with the provided email
    const user = await this.userRepository.findOne({ where: { email } });

    // Check if user exists
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    // Check if user was authenticated using Google OAuth2
    if (!user.passwordHash) {
      throw new BadRequestException('You were authorized by Google earlier. Please, sign in again via Google and add a password in your profile.');
    }

    // Compare password
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw new BadRequestException('Incorrect user password');
    }

    // Generate access and refresh tokens
    console.log(user);
    const accessToken = this.tokenService.generateAccessToken(user.id, user.email, user.roleId);
    const refreshToken = this.tokenService.generateRefreshToken(user.id, user.email, user.roleId);
    const token = await this.tokenService.saveToken(user.id, refreshToken);

    user.token = token;
    await this.userRepository.save(user);

    // Return user information and tokens
    return {
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Register a new user
   * @param userRegisterDto - Object containing user registration details
   * @returns Object containing access and refresh tokens
   */
  async register(userRegisterDto: UserRegisterDto) {
    const { name, lastname, patronymic, email, password } = userRegisterDto;

    // Check if user with the provided email already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = this.userRepository.create({
      name,
      lastname,
      patronymic,
      email,
      passwordHash,
    });

    // Save new user
    const newUser = await this.userRepository.save(user);

    // Generate access and refresh tokens
    const accessToken = this.tokenService.generateAccessToken(newUser.id, newUser.email, newUser.roleId);
    const refreshToken = this.tokenService.generateRefreshToken(newUser.id, newUser.email, newUser.roleId);
    const token = await this.tokenService.saveToken(newUser.id, refreshToken);

    // Save refresh token to the user
    newUser.token = token;
    await this.userRepository.save(newUser);

    // Return user information and tokens
    return {
      id: newUser.id,
      email: newUser.email,
      accessToken,
      refreshToken,
    };
  }
  /**
   * Get user full data
   * @param userId - User id
   */
  async getProfile(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    return {
      id: user.id,
      firstname: user.name,
      lastname: user.lastname,
      patronymic: user.patronymic,
      email: user.email
    }
  }


  /**
   * Delete refresh token
   * @param refreshToken - Refresh token to be deleted
   */
  async logout(refreshToken: string): Promise<void> {
    const tokenId = (await this.tokenService.findTokenByRefreshToken(refreshToken)).id;

    const user = await this.userRepository.findOne({ where: { tokenId } });
    user.tokenId = null;
    await this.userRepository.save(user);
    await this.tokenService.deleteToken(refreshToken);
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param userData - User data to be updated
   * @returns Updated user information
   */
  async updateProfile(userId: number, userData: UserUpdateDataDto): Promise<User> {
    // Find user by ID
    const user = await this.userRepository.findOne({ where: { id: userId } });
    // If user not found, throw error
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user data
    for (const key in userData) {
      if (key === 'password') {
        user.passwordHash = await bcrypt.hash(userData.password, 10);
      }
      else {
        user[key] = userData[key]
      }
    }

    // Save updated user data
    return await this.userRepository.save(user);;
  }

  /**
   * Refresh access token
   * @param refreshToken - Refresh token
   * @returns Object containing new access and refresh tokens
   */
  async refreshToken(refreshToken: string) {
    // Check if refresh token is provided
    if (!refreshToken) throw new UnauthorizedException('Invalid token');

    // Validate refresh token
    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const token = await this.tokenService.findTokenByRefreshToken(refreshToken);

    // If validation fails or token is not found, throw unauthorized exception
    if (!userData || !token) {
      throw new UnauthorizedException('Invalid token');
    }

    // Find user ID and email by token
    const { userId } = token;
    const { id, email, roleId } = (await this.userRepository.findOne({ where: { id: userId } }));

    // Generate new access and refresh tokens
    const newAccessToken = this.tokenService.generateAccessToken(id, email, roleId);
    const newRefreshToken = this.tokenService.generateRefreshToken(id, email, roleId);

    // Save new refresh token
    await this.tokenService.saveToken(id, newRefreshToken);

    // Return new tokens
    return { id, email, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }


  async getUsersEmails(userIds: number[]) {
    return (await this.userRepository.find({ where: { id: In(userIds) } })).map(user => ({ email: user.email, firstname: user.name, lastname: user.lastname }));
  }
}
