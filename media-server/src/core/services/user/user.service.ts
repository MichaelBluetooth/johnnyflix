import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/core/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        private config: ConfigService,
        @InjectRepository(User) private userRepo: Repository<User>
    ) { }

    async findUserByEmail(email: string) {
        const user = await this.userRepo.findOneBy({ email });
        if (!user) {
            return null;
        } else {
            return user;
        }
    }
    
    async deleteUser(email: string) {
        const user = await this.findUserByEmail(email);
        if (user) {
            await this.userRepo.remove(user);
            return true;
        } else {
            return false;
        }
    }

    async registerUser(email: string, password: string) {
        const allowedEmails = new Set<string>(this.config.get<string[]>('authorized_emails').map(allowedEmail => allowedEmail.toLowerCase()));
        if (!allowedEmails.has(email.toLowerCase())) {
            this.logger.debug(`Email [${email}] attempted to register, but was not authorized on this deployment`);
            throw new BadRequestException("Email is not authorized for this deployment")
        }

        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            this.logger.debug(`Email [${email}] attempted to register, but was already registered`);
            throw new BadRequestException("Email is already registered");
        }

        const hashedPwd = await this.hashPassword(password);
        const newUser = new User();
        newUser.email = email;
        newUser.password = hashedPwd;
        newUser.lastLogin = null;

        return this.userRepo.save(newUser);
    }

    async updateUserLastLogin(id: number) {
        const user = await this.userRepo.findOneBy({ id });
        if (user) {
            user.lastLogin = new Date();
            this.userRepo.save(user);
        }
    }

    async hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }
}
