import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtAuthGuard } from './guards/jtw-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      RefreshToken, 
    ]) 
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
