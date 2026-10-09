import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import databaseConfig from "./config/database.config";
import { User } from "./modules/users/entities/user.entity";
import { Student } from "./modules/students/entities/student.entity";
import { Session } from "./modules/sessions/entities/session.entity";
import { Payment } from "./modules/payments/entities/payment.entity";

import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { StudentsModule } from "./modules/students/students.module";
import { SessionsModule } from "./modules/sessions/sessions.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { ShareModule } from "./modules/share/share.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [databaseConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("database.host"),
        port: config.get<number>("database.port"),
        username: config.get<string>("database.username"),
        password: config.get<string>("database.password"),
        database: config.get<string>("database.database"),
        entities: [User, Student, Session, Payment],
        synchronize: true,
        logging: false,
      }),
    }),

    UsersModule,
    AuthModule,
    StudentsModule,
    SessionsModule,
    PaymentsModule,
    ShareModule,
    AdminModule,
  ],
})
export class AppModule {}