import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from './core/guards/roles.guard'
import { AuthGuard } from './core/guards/auth.guard'
import { ApplicationsModule } from './applications/applications.module'
import { PrismaModule } from './core/prisma/prisma.module'
import { ProductsModule } from './products/products.module'
import { DocumentsModule } from './documents/documents.module'
import { LoansModule } from './loans/loans.module'
import { OfficeModule } from './office/office.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
    }),
    PrismaModule,
    ApplicationsModule,
    ProductsModule,
    DocumentsModule,
    LoansModule,
    OfficeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
