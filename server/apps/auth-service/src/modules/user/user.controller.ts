import { Controller, HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UserDto, UserTokens, UserLoginDto, UserRegisterDto, UserUpdateDataDto, TokenVerificationDto } from '@app/dtos';
import { GET_PROFILE, GET_USERS_EMAILS, GOOGLE_AUTH, LOGIN, LOGOUT, REFRESH_TOKEN, REGISTER, UPDATE_PROFILE } from '@app/messages';
import { handleRpcError } from '@app/utils';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }


    @MessagePattern({ cmd: GOOGLE_AUTH })
    async googleAuth(@Payload() tokenVerification: TokenVerificationDto, @Ctx() context: RmqContext) {
        try {
            return await this.userService.googleAuth(tokenVerification);
        } catch (error) {
            await handleRpcError(error);
        }
    }

    @MessagePattern({ cmd: LOGIN })
    async login(@Payload() userLoginDto: UserLoginDto, @Ctx() context: RmqContext): Promise<UserTokens> {
        try {
            return await this.userService.login(userLoginDto);
        } catch (error) {
            await handleRpcError(error);
        }
    }

    @MessagePattern({ cmd: REGISTER })
    async register(@Payload() userRegisterDto: UserRegisterDto, @Ctx() context: RmqContext): Promise<UserTokens> {
        try {
            return await this.userService.register(userRegisterDto);
        } catch (error) {
            await handleRpcError(error);
        }
    }

    @MessagePattern({ cmd: LOGOUT })
    async logout(@Payload() refreshToken: string, @Ctx() context: RmqContext) {
        try {
            await this.userService.logout(refreshToken);
            return true;
        } catch (error) {
            await handleRpcError(error);
        }
    }

    @MessagePattern({ cmd: GET_PROFILE })
    async getProfile(@Payload() userId: number, @Ctx() context: RmqContext): Promise<UserDto> {
        try {
            return await this.userService.getProfile(userId);
        } catch (error) {
            await handleRpcError(error);
        }
    }

    @MessagePattern({ cmd: UPDATE_PROFILE })
    async updateProfile(@Payload() data: { id: number, userData: UserUpdateDataDto }, @Ctx() context: RmqContext) {
        try {
            const { id, userData } = data;
            return await this.userService.updateProfile(id, userData);
        } catch (error) {
            await handleRpcError(error);
        }
    }

    @MessagePattern({ cmd: REFRESH_TOKEN })
    async refreshToken(@Payload() refreshToken: string, @Ctx() context: RmqContext): Promise<UserTokens | null> {
        try {
            return await this.userService.refreshToken(refreshToken);
        } catch (error) {
            await handleRpcError(error);
        }
    }

    @MessagePattern({ cmd: GET_USERS_EMAILS })
    async getUsersEmails(@Payload() userIds: number[], @Ctx() context: RmqContext) {
        try {
            return await this.userService.getUsersEmails(userIds);
        } catch (error) {
            await handleRpcError(error);
        }
    }
}
