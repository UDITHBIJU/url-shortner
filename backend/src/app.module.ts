import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LinksModule } from './links/links.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities/user.entity';
import { Link } from './links/entities/link.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { JwtModule } from '@nestjs/jwt';
import { RedirectModule } from './redirect/redirect.module';

@Module({
  imports: [
    AuthModule,
    LinksModule,
    JwtModule.register({
      secret: 'key',
      global: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'url_shortener',
      entities: [User,Link, RefreshToken],
      synchronize: true,
    }),
    RedirectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
