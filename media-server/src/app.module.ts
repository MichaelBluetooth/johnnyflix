import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'nest_test',
      username: 'nest_test',
      autoLoadEntities: true,
      database: 'nest_test_db',

      synchronize: true,
      // logging: true, //Enable me for verbose DB queries
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '.', 'client')
    // }),
    CacheModule.register({
      isGlobal: true,
      max: 5,
      ttl: 20000
    }),
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {

}
