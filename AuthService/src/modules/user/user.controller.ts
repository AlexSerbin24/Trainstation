import { Body, Controller, Delete, Get, HttpStatus, Ip, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserLoginDto } from '../../dto/user-login.dto';
import { UserRegisterDto } from '../../dto/user-register.dto';
import { UserUpdateDataDto } from '../../dto/user-update.dto';
import { Response, Request, response } from 'express';
import { User } from '../../decorators/request-user.decorator';
import { TokenVerificationDto } from '../../dto/token-verification.dto';

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // @Get('google')
    // @UseGuards(AuthGuard('google'))
    // async googleAuth() { }

    // @Get('google/callback')
    // @UseGuards(AuthGuard('google'))
    // async googleAuthRedirect(@Res() response: Response, @User() user:GoogleAuth) {
    //     // const token = this.authService.googleLogin(req);
    //     // res.redirect(`http://localhost:3000/login/callback?token=${token}`);

        
    //     const { refreshToken, ...data } = await this.userService.googleAuth(user);
    //     this.setCookies(response, refreshToken);

    //     console.log(data)
    //     return data;

    // }

    @Post('google')
    async googleAuth(@Res({ passthrough: true }) response: Response, @Body() tokenVerification: TokenVerificationDto) {
        const {refreshToken,...data}= await this.userService.googleAuth(tokenVerification);
        this.setCookies(response, refreshToken);
        return data;
    }

    @Post('login')
    async login(@Res({ passthrough: true }) response: Response, @Body() userLoginDto: UserLoginDto) {
        const { refreshToken, ...data } = await this.userService.login(userLoginDto);
        this.setCookies(response, refreshToken);
        return data;


    }

    @Post('register')
    async register(@Res({ passthrough: true }) response: Response, @Body() userRegisterDto: UserRegisterDto) {
        const { refreshToken, ...data } = await this.userService.register(userRegisterDto);
        this.setCookies(response, refreshToken);
        return data;
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response, @Body('refreshToken') refreshToken: string) {
        this.clearCookies(response);
        return this.userService.logout(refreshToken);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('update-profile/:id')
    async updateProfile(@Param('id')id:number, @Body() userData: UserUpdateDataDto) {
        console.log(id)
        console.log(userData)
        return this.userService.updateProfile(id, userData);
    }

    @Post('refresh-token')
    async refreshToken(@Res({ passthrough: true }) response: Response, @Body('refreshToken') refreshToken: string) {
        const { refreshToken: newRefreshToken, ...data } = await this.userService.refreshToken(refreshToken);
        this.setCookies(response, newRefreshToken);
        return data;
    }

    private setCookies(response: Response, refreshToken: string) {
        response.cookie('refresh_token', refreshToken, { httpOnly: true });
    }

    private clearCookies(response: Response) {
        response.clearCookie('refresh_token');
    }
}
