import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { User } from '../../entities/user.entity';
import { UserLoginDto, UserRegisterDto } from '@app/dtos';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Auth } from 'googleapis';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let service: UserService;
  let userRepositoryMock: any;
  let tokenServiceMock: any;

  beforeEach(async () => {

    userRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn()
    };

    tokenServiceMock = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      saveToken: jest.fn(),
      deleteToken: jest.fn(),
      validateRefreshToken: jest.fn(),
      findTokenByRefreshToken: jest.fn(),
    };

    //FOR GOOGLE AUTH TESTS
    const configureServiceMock = {
      get: jest.fn().mockImplementation(key => {
        switch (key) {
          case 'CLIENT_ID':
            return 'YOUR_CLIENT_ID';
          case 'CLIENT_SECRET':
            return 'YOUR_CLIENT_SECRET';
          default:
            return null;
        }
      })
    };


    const mockOAuthClient: Auth.OAuth2Client = {
      verifyIdToken: jest.fn().mockResolvedValue({
        getPayload: jest.fn().mockReturnValue({
          email: 'test@example.com',
          name: 'Test User'
        })
      })
    } as any;
    ////////////

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepositoryMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: ConfigService, useValue: configureServiceMock },
        JwtService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    service.oauthClient = mockOAuthClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should create tokens for existing user in google authentication', async () => {
    // Arrange

    const existingUser = {
      id: 1,
      email: 'test@example.com',
    };

    const accessToken = 'test_access_token';
    const refreshToken = 'test_refresh_token';

    userRepositoryMock.findOne.mockResolvedValue(existingUser);
    tokenServiceMock.generateAccessToken.mockReturnValue(accessToken);
    tokenServiceMock.generateRefreshToken.mockReturnValue(refreshToken);
    tokenServiceMock.saveToken.mockResolvedValue({ refreshToken });

    // Act
    const result = await service.googleAuth({ token: "google_token" });

    // Assert
    expect(result.id).toBe(existingUser.id);
    expect(result.email).toBe(existingUser.email);
    expect(result.accessToken).toBe(accessToken);
    expect(result.refreshToken).toBe(refreshToken);

    expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('should create tokens for new user in google authentication', async () => {
    // Arrange

    const accessToken = 'test_access_token';
    const refreshToken = 'test_refresh_token';

    userRepositoryMock.findOne.mockResolvedValue(null);
    userRepositoryMock.save.mockResolvedValue({ id: 2, email: 'test@example.com' });
    tokenServiceMock.generateAccessToken.mockReturnValue(accessToken);
    tokenServiceMock.generateRefreshToken.mockReturnValue(refreshToken);
    tokenServiceMock.saveToken.mockResolvedValue({ refreshToken });


    // Act
    const result = await service.googleAuth({ token: "google_token" });

    // Assert
    expect(result.id).toBe(2);
    expect(result.email).toBe("test@example.com")
    expect(result.accessToken).toBe(accessToken);
    expect(result.refreshToken).toBe(refreshToken);

    expect(userRepositoryMock.save).toHaveBeenCalledTimes(2);
  });


  //LOGIN

  it("should authenticate user and return access and refresh tokens if user exists and password is correct", async () => {
    // Arrange
    const userLoginDto: UserLoginDto = {
      email: "existing_user@example.com",
      password: "correctPassword",
    };
    const expectedTokens = {
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    };

    userRepositoryMock.findOne.mockResolvedValue({
      id: 1,
      roleId: 1,
      email: userLoginDto.email,
      passwordHash: await bcrypt.hash(userLoginDto.password, 10),
    });

    tokenServiceMock.generateAccessToken.mockReturnValue(expectedTokens.accessToken);
    tokenServiceMock.generateRefreshToken.mockReturnValue(expectedTokens.refreshToken);
    tokenServiceMock.saveToken.mockResolvedValue();

    // Act
    const result = await service.login(userLoginDto);

    // Assert
    expect(result).toEqual({
      id: 1,
      email: userLoginDto.email,
      accessToken: expectedTokens.accessToken,
      refreshToken: expectedTokens.refreshToken,
    });

    expect(tokenServiceMock.generateAccessToken).toHaveBeenCalledWith(1, userLoginDto.email, 1);
    expect(tokenServiceMock.generateRefreshToken).toHaveBeenCalledWith(1, userLoginDto.email, 1);
    expect(tokenServiceMock.saveToken).toHaveBeenCalledWith(1, expectedTokens.refreshToken);
  });

  it("should throw BadRequestException if user exists but password is incorrect", async () => {
    const userLoginDto: UserLoginDto = {
      email: "existing_user@example.com",
      password: "incorrectPassword",
    };

    userRepositoryMock.findOne.mockResolvedValue({
      email: userLoginDto.email,
      passwordHash: await bcrypt.hash("correctPassword", 10), // Incorrect password
    });

    await expect(service.login(userLoginDto)).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException if user does not exist", async () => {
    // Arrange
    const userLoginDto: UserLoginDto = {
      email: "non_existing_user@example.com",
      password: "anyPassword",
    };

    userRepositoryMock.findOne.mockResolvedValue(null);

    // Act & Assert
    await expect(service.login(userLoginDto)).rejects.toThrow(BadRequestException);
  });


  //REGISTER
  it("should throw BadRequestException if user with the provided email already exists", async () => {
    // Arrange
    const userRegisterDto: UserRegisterDto = {
      name: "John",
      lastname: "Doe",
      patronymic: "Smith",
      email: "existing_user@example.com",
      password: "password123",
      confirmPassword: "password123"
    };

    userRepositoryMock.findOne.mockResolvedValue({ email: userRegisterDto.email });

    // Act & Assert
    await expect(service.register(userRegisterDto)).rejects.toThrow(BadRequestException);
  });

  it("should create new user and return access and refresh tokens if user does not exist", async () => {
    // Arrange
    const userRegisterDto: UserRegisterDto = {
      name: "John",
      lastname: "Doe",
      patronymic: "Smith",
      email: "new_user@example.com",
      password: "password123",
      confirmPassword: "password123"
    };
    const expectedTokens = {
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    };

    userRepositoryMock.findOne.mockResolvedValue(null);
    userRepositoryMock.create.mockReturnValue(userRegisterDto);
    userRepositoryMock.save.mockResolvedValue({ id: 1, ...userRegisterDto, roleId:1 });

    tokenServiceMock.generateAccessToken.mockReturnValue(expectedTokens.accessToken);
    tokenServiceMock.generateRefreshToken.mockReturnValue(expectedTokens.refreshToken);
    tokenServiceMock.saveToken.mockResolvedValue();

    // Act
    const result = await service.register(userRegisterDto);

    // Assert
    expect(result).toEqual({
      id: 1,
      email: userRegisterDto.email,
      accessToken: expectedTokens.accessToken,
      refreshToken: expectedTokens.refreshToken,
    });

    expect(tokenServiceMock.generateAccessToken).toHaveBeenCalledWith(1, userRegisterDto.email,1);
    expect(tokenServiceMock.generateRefreshToken).toHaveBeenCalledWith(1, userRegisterDto.email,1);
    expect(tokenServiceMock.saveToken).toHaveBeenCalledWith(1, expectedTokens.refreshToken);
  });



  //LOGOUT

  it("should delete token when user logs out", async () => {
    // Arrange
    const refreshToken = "mockRefreshToken";

    // Act
    await service.logout(refreshToken);

    // Assert
    expect(tokenServiceMock.deleteToken).toHaveBeenCalledWith(refreshToken);
  });


  //REFRESH_TOKEN

  it("should refresh token and return new access and refresh tokens", async () => {
    // Arrange
    const refreshToken = "mockRefreshToken";
    const userId = 1;
    const email = "test@example.com";
    const newAccessToken = "newAccessToken";
    const newRefreshToken = "newRefreshToken";
    const token = {
      userId,
      refreshToken
    };
    const user = {
      id: userId,
      email
    };

    tokenServiceMock.validateRefreshToken.mockReturnValue(user);
    tokenServiceMock.findTokenByRefreshToken.mockResolvedValue(token);
    tokenServiceMock.generateAccessToken.mockReturnValue(newAccessToken);
    tokenServiceMock.generateRefreshToken.mockReturnValue(newRefreshToken);
    userRepositoryMock.findOne.mockResolvedValue(user);

    // Act
    const result = await service.refreshToken(refreshToken);

    // Assert
    expect(tokenServiceMock.validateRefreshToken).toHaveBeenCalledWith(refreshToken);
    expect(tokenServiceMock.findTokenByRefreshToken).toHaveBeenCalledWith(refreshToken);
    expect(result).toEqual({
      id: userId,
      email,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  });

  it("should throw UnauthorizedException if refresh token is invalid", async () => {
    // Arrange
    const refreshToken = "invalidRefreshToken";
    tokenServiceMock.validateRefreshToken.mockReturnValue(null);

    // Act + Assert
    await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
  });

  it("should throw UnauthorizedException if token not found", async () => {
    // Arrange
    const refreshToken = "mockRefreshToken";
    tokenServiceMock.validateRefreshToken.mockReturnValue({});
    tokenServiceMock.findTokenByRefreshToken.mockResolvedValue(null);

    // Act + Assert
    await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
  });

  it("should throw UnauthorizedException if user not found", async () => {
    // Arrange
    const refreshToken = "mockRefreshToken";
    const userId = 1;
    const token = {
      userId,
      refreshToken
    };
    tokenServiceMock.validateRefreshToken.mockReturnValue(null);
    tokenServiceMock.findTokenByRefreshToken.mockResolvedValue(token);

    // Act + Assert
    await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
  });

});
