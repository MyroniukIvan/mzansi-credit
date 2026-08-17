import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ApplicationStatus, DocumentStatus, PrismaClient } from 'db'
import { ApplicationStatus as ApplicationStatusType } from 'shared'
import { PRISMA } from '../core/prisma/prisma.module'
import { ScoringDisbursement } from '../scoring/scoring.disbursement'
import { DocumentsService } from '../documents/documents.service'
import {
  OfficeDecisionInput,
  OfficeDocumentReviewInput,
} from './office.schemas'

const AUDIT_ENTITY_TYPE_APPLICATION = 'loan_application'
const AUDIT_ENTITY_TYPE_DOCUMENT = 'document'

@Injectable()
export class OfficeService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly disbursement: ScoringDisbursement,
    private readonly documentsService: DocumentsService
  ) {}

  async findQueue(status: ApplicationStatusType) {
    const applications = await this.prisma.loanApplication.findMany({
      where: { status },
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true,
        amountCents: true,
        termMonths: true,
        status: true,
        submittedAt: true,
        createdAt: true,
        score: true,
        user: {
          select: { name: true, _count: { select: { documents: true } } },
        },
      },
    })

    return applications.map((application) => ({
      id: application.id,
      applicantName: application.user.name,
      amountCents: application.amountCents,
      termMonths: application.termMonths,
      status: application.status,
      submittedAt: (
        application.submittedAt ?? application.createdAt
      ).toISOString(),
      score: application.score,
      documentsCount: application.user._count.documents,
    }))
  }

  async findOne(id: string) {
    const application = await this.prisma.loanApplication.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        amountCents: true,
        termMonths: true,
        score: true,
        decisionReason: true,
        submittedAt: true,
        decidedAt: true,
        idNumber: true,
        phone: true,
        address: true,
        employer: true,
        incomeCents: true,
        expensesCents: true,
        userId: true,
        user: { select: { id: true, name: true, email: true } },
        product: {
          select: {
            id: true,
            name: true,
            monthlyInterestBps: true,
            initiationFeeBps: true,
            monthlyServiceFeeCents: true,
          },
        },
      },
    })
    if (!application) throw new NotFoundException()

    const applicantDocuments = await this.prisma.document.findMany({
      where: { userId: application.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        status: true,
        rejectionReason: true,
        createdAt: true,
        s3Key: true,
      },
    })

    const documents = await Promise.all(
      applicantDocuments.map(async (document) => ({
        id: document.id,
        type: document.type,
        status: document.status,
        rejectionReason: document.rejectionReason,
        createdAt: document.createdAt.toISOString(),
        downloadUrl: await this.documentsService.presignDownloadUrl(
          document.s3Key
        ),
      }))
    )

    return {
      id: application.id,
      status: application.status,
      amountCents: application.amountCents,
      termMonths: application.termMonths,
      score: application.score,
      decisionReason: application.decisionReason,
      submittedAt: application.submittedAt?.toISOString() ?? null,
      decidedAt: application.decidedAt?.toISOString() ?? null,
      applicant: application.user,
      personal: {
        idNumber: application.idNumber,
        phone: application.phone,
        address: application.address,
        employer: application.employer,
        incomeCents: application.incomeCents,
        expensesCents: application.expensesCents,
      },
      product: application.product,
      documents,
    }
  }

  async decide(id: string, actorId: string, input: OfficeDecisionInput) {
    const application = await this.prisma.loanApplication.findUnique({
      where: { id },
      select: { id: true, status: true },
    })
    if (!application) throw new NotFoundException()
    if (application.status !== ApplicationStatus.manual_review) {
      throw new ConflictException('Application is not awaiting manual review')
    }

    const toStatus =
      input.decision === 'approved'
        ? ApplicationStatus.approved
        : ApplicationStatus.rejected

    await this.prisma.$transaction(async (tx) => {
      await tx.loanApplication.update({
        where: { id },
        data: {
          status: toStatus,
          decisionReason: input.comment,
          decidedAt: new Date(),
          reviewedById: actorId,
        },
      })

      await tx.auditLog.create({
        data: {
          actorId,
          entityType: AUDIT_ENTITY_TYPE_APPLICATION,
          entityId: id,
          action: 'decision',
          fromStatus: ApplicationStatus.manual_review,
          toStatus,
        },
      })
    })

    if (input.decision === 'approved') {
      await this.disbursement.disburse(id)
    }
  }

  async reviewDocument(
    id: string,
    actorId: string,
    input: OfficeDocumentReviewInput
  ) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      select: { id: true, status: true },
    })
    if (!document) throw new NotFoundException()

    const toStatus =
      input.status === 'verified'
        ? DocumentStatus.verified
        : DocumentStatus.rejected

    await this.prisma.$transaction(async (tx) => {
      await tx.document.update({
        where: { id },
        data: {
          status: toStatus,
          reviewedById: actorId,
          rejectionReason: input.status === 'rejected' ? input.reason : null,
        },
      })

      await tx.auditLog.create({
        data: {
          actorId,
          entityType: AUDIT_ENTITY_TYPE_DOCUMENT,
          entityId: id,
          action: 'review',
          fromStatus: document.status,
          toStatus,
        },
      })
    })
  }
}
