import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.local.env'] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST') || 'localhost',
        port: configService.get<number>('DATABASE_PORT') || 3306,
        username: configService.get('DATABASE_USERNAME') || 'root',
        password: configService.get('DATABASE_PASSWORD') || '',
        database: configService.get('DATABASE_NAME') || 'nestjs',
        synchronize: configService.get<boolean>('DATABASE_SYNC') || true,
        logging: configService.get('DATABASE_LOGGING'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
    }),
    TodoModule,
    UserModule,
    AuthModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
