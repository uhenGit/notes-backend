import { Module } from '@nestjs/common';
import { NotesModule } from './notes/notes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        uri: configService.get('DB_CONFIG'),
      }),
      inject: [ConfigService],
    }),
    NotesModule,
  ],
})
export class AppModule {}
