import { Body, Controller, Get, Inject, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto, UserTokens, TokenVerificationDto, UserLoginDto, UserRegisterDto, UserUpdateDataDto } from "@app/dtos"
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GATEWAY_AUTH_SERVICE } from '../constants/services.constants';
import { GET_PROFILE, GOOGLE_AUTH, LOGIN, LOGOUT, REFRESH_TOKEN, REGISTER, UPDATE_PROFILE } from '@app/messages';

@Controller('auth')
export class AuthServiceController {
    constructor(
        @Inject(GATEWAY_AUTH_SERVICE)
        private readonly gatewayUserProxy: ClientProxy,
    ) { }

    @Post('/google_auth')
    async googleAuth(@Body() tokenVerification: TokenVerificationDto) {
        return await lastValueFrom(this.gatewayUserProxy.send({ cmd: GOOGLE_AUTH }, tokenVerification));
    }

    @Post('/login')
    async login(@Res({ passthrough: true }) response: Response, @Body() userLoginDto: UserLoginDto) {
        const { refreshToken, ...userData } = await lastValueFrom(this.gatewayUserProxy.send<UserTokens>({ cmd: LOGIN }, userLoginDto));
        response.cookie('refresh_token', refreshToken, { httpOnly: true });
        return userData;

    }

    @Post('/register')
    async register(@Res({ passthrough: true }) response: Response, @Body() userRegisterDto: UserRegisterDto) {
        const { refreshToken, ...userData } = await lastValueFrom(this.gatewayUserProxy.send({ cmd: REGISTER }, userRegisterDto));
        response.cookie('refresh_token', refreshToken, { httpOnly: true });
        return userData
    }


    @Post('/logout')
    @UseGuards(AuthGuard("jwt"))
    async logout(@Res({ passthrough: true }) response: Response, @Body() data:{refreshToken: string}) {
        const {refreshToken} = data;
        const result = await lastValueFrom(this.gatewayUserProxy.send<boolean>({ cmd: LOGOUT }, refreshToken));
        response.clearCookie('refresh_token');
        return result;

    }

    @Get('/get_profile/:userId')
    @UseGuards(AuthGuard("jwt"))
    async getProfile(@Param("userId") userId: number): Promise<UserDto> {
        return await lastValueFrom(this.gatewayUserProxy.send({ cmd: GET_PROFILE }, userId));
    }

    @Post('/update_profile/:userId')
    @UseGuards(AuthGuard("jwt"))
    async updateProfile(@Param("userId") userId: number, @Body() userData: UserUpdateDataDto) {

        return await lastValueFrom(this.gatewayUserProxy.send({ cmd: UPDATE_PROFILE }, { id: userId, userData }));
    }

    @Post('/refresh_token')
    async refreshToken(@Res({ passthrough: true }) response: Response, @Body() data: { refreshToken: string }) {
        const { refreshToken } = data;
        const { refreshToken: newRefreshToken, ...userData } = await lastValueFrom(this.gatewayUserProxy.send<UserTokens>({ cmd: REFRESH_TOKEN }, refreshToken));
        response.cookie('refresh_token', newRefreshToken, { httpOnly: true });
        return userData
    }
}
