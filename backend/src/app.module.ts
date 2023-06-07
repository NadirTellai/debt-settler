import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SettlementsModule } from './settlements/settlements.module';
import { ParticipantsModule } from './participants/participants.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from "@nestjs/config";
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';
import {DataSource} from "typeorm";
import { TypeOrmConfigService } from './database/typeorm-config.service';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize()
        return dataSource;
      },

    }),
    SettlementsModule,
    ParticipantsModule,
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
