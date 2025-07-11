import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth/auth.service';
import { JwtAuthGuard } from './auth/auth/jwt-auth.guard';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'chat',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // 在生产环境中请设置为 false
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AuthService, JwtAuthGuard],
})
export class AppModule {}
