import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LoginRequest } from 'src/auth/dto/login.dto';
import { RegisterUserRequest } from 'src/auth/dto/register-user.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { AuthGuard } from 'src/core/guards/auth.guard';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginData: LoginRequest, @Res({ passthrough: true }) response: Response) {
        const loginResp = await this.authService.signIn(loginData.email, loginData.password);
        response.cookie('access_token', loginResp.access_token, { httpOnly: true, sameSite: 'lax'});
        return { access_token: loginResp.access_token };
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('access_token', { httpOnly: true, sameSite: 'lax' });
        response.status(HttpStatus.NO_CONTENT);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('ping')
    async ping() {
        return { loggedIn: true };
    }

    // @HttpCode(HttpStatus.OK)
    // @Post('register')
    // async register(@Body() registerData: RegisterUserRequest, @Res() res: Response) {
    //     await this.authService.registerUser(registerData.email, registerData.password);
    //     return res.status(HttpStatus.NO_CONTENT);
    // }
}
