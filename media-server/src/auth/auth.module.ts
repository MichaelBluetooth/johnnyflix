import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { CoreModule } from 'src/core/core.module';
import { AuthController } from './controllers/auth/auth.controller';

@Module({
  imports: [
    CoreModule    
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
