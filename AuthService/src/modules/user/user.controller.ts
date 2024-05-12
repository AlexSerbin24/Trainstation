import { Body, Controller, Delete, Get, HttpStatus, Ip, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserLoginDto } from '../../dto/user-login.dto';
import { UserRegisterDto } from '../../dto/user-register.dto';
import { UserUpdateDataDto } from '../../dto/user-update.dto';
import { Response } from 'express';
import { User } from '../../decorators/request-user.decorator';
import { TokenVerificationDto } from '../../dto/token-verification.dto';

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) { }

    /**
     * Authenticate user using Google OAuth2 token
     * @param response - Express Response object
     * @param tokenVerification - Object containing Google OAuth2 token
     * @returns Object containing access and refresh tokens
     */
    @Post('google')
    async googleAuth(@Res({ passthrough: true }) response: Response, @Body() tokenVerification: TokenVerificationDto) {
        const {refreshToken,...data}= await this.userService.googleAuth(tokenVerification);
        this.setCookies(response, refreshToken);
        return data;
    }

    /**
     * Authenticate user using email and password
     * @param response - Express Response object
     * @param userLoginDto - Object containing user email and password
     * @returns Object containing access and refresh tokens
     */
    @Post('login')
    async login(@Res({ passthrough: true }) response: Response, @Body() userLoginDto: UserLoginDto) {
        const { refreshToken, ...data } = await this.userService.login(userLoginDto);
        this.setCookies(response, refreshToken);
        return data;
    }

    /**
     * Register a new user
     * @param response - Express Response object
     * @param userRegisterDto - Object containing user registration details
     * @returns Object containing access and refresh tokens
     */
    @Post('register')
    async register(@Res({ passthrough: true }) response: Response, @Body() userRegisterDto: UserRegisterDto) {
        const { refreshToken, ...data } = await this.userService.register(userRegisterDto);
        this.setCookies(response, refreshToken);
        return data;
    }

    /**
     * Delete refresh token
     * @param response - Express Response object
     * @param refreshToken - Refresh token to be deleted
     */
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response, @Body('refreshToken') refreshToken: string) {
        this.clearCookies(response);
        return this.userService.logout(refreshToken);
    }

    /**
     * Update user profile
     * @param id - User ID
     * @param userData - User data to be updated
     * @returns Updated user information
     */
    @UseGuards(AuthGuard('jwt'))
    @Post('update-profile/:id')
    async updateProfile(@Param('id') id: number, @Body() userData: UserUpdateDataDto) {
        return this.userService.updateProfile(id, userData);
    }

    /**
     * Refresh access token
     * @param response - Express Response object
     * @param refreshToken - Refresh token
     * @returns Object containing new access and refresh tokens
     */
    @Post('refresh-token')
    async refreshToken(@Res({ passthrough: true }) response: Response, @Body('refreshToken') refreshToken: string) {
        const { refreshToken: newRefreshToken, ...data } = await this.userService.refreshToken(refreshToken);
        this.setCookies(response, newRefreshToken);
        return data;
    }

    /**
     * Set refresh token as a cookie
     * @param response - Express Response object
     * @param refreshToken - Refresh token
     */
    private setCookies(response: Response, refreshToken: string) {
        response.cookie('refresh_token', refreshToken, { httpOnly: true });
    }

    /**
     * Clear refresh token cookie
     * @param response - Express Response object
     */
    private clearCookies(response: Response) {
        response.clearCookie('refresh_token');
    }
}