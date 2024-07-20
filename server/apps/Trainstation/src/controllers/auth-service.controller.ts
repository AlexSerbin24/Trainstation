import { Body, Controller, Get, Inject, Param, Post, Put, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto, UserTokens, TokenVerificationDto, UserLoginDto, UserRegisterDto, UserUpdateDataDto } from "@app/dtos"
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
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
        lastValueFrom(this.gatewayUserProxy.send<UserTokens>({ cmd: LOGIN }, userLoginDto)).catch((error)=>{console.log("dffdfdfd");console.log(error)});
        const { refreshToken, ...userData } = await lastValueFrom(this.gatewayUserProxy.send<UserTokens>({ cmd: LOGIN }, userLoginDto))
        response.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        return userData;

    }

    @Post('/register')
    async register(@Res({ passthrough: true }) response: Response, @Body() userRegisterDto: UserRegisterDto) {
        const { refreshToken, ...userData } = await lastValueFrom(this.gatewayUserProxy.send({ cmd: REGISTER }, userRegisterDto));
        response.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        return userData
    }

    @Post('/refresh_token')
    async refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies['refresh_token'];
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }



        const refreshTokenData = await lastValueFrom(
            this.gatewayUserProxy.send<UserTokens>({ cmd: REFRESH_TOKEN }, refreshToken)
        );


        const { refreshToken: newRefreshToken, ...userData } = refreshTokenData;
        response.cookie('refresh_token', newRefreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        return userData;

    }



    @Post('/logout')
    @UseGuards(AuthGuard("jwt"))
    async logout(@Res({ passthrough: true }) response: Response, @Req() request: Request) {
        const refreshToken = request.cookies['refresh_token'];
        const result = await lastValueFrom(this.gatewayUserProxy.send<boolean>({ cmd: LOGOUT }, refreshToken));
        response.clearCookie('refresh_token');
        return result;
    }

    @Get('/get_profile/:userId')
    @UseGuards(AuthGuard("jwt"))
    async getProfile(@Param("userId") userId: number): Promise<UserDto> {
        return await lastValueFrom(this.gatewayUserProxy.send({ cmd: GET_PROFILE }, userId));
    }

    @Put('/update_profile/:userId')
    @UseGuards(AuthGuard("jwt"))
    async updateProfile(@Param("userId") userId: number, @Body() userData: UserUpdateDataDto) {

        return await lastValueFrom(this.gatewayUserProxy.send({ cmd: UPDATE_PROFILE }, { id: userId, userData }));
    }
}
