import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/core/services/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private users: UserService,
        private jwtService: JwtService) { }

    async signIn(email: string, password: string) {
        const user = await this.users.findUserByEmail(email);
        if(!user){
            this.logger.debug(`User [${email}] attempted to sign in, but is not registered`);
            throw new UnauthorizedException();
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {            
            this.logger.debug(`User [${email}] attempted to sign in, but failed the password check`);
            throw new UnauthorizedException();            
        }

        await this.users.updateUserLastLogin(user.id);
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async registerUser(email: string, password: string) {
        await this.users.registerUser(email, password);
    }
}
