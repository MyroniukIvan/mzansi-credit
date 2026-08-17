import { randomUUID } from 'node:crypto'
import {
  ForbiddenException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import {
  BucketAlreadyExists,
  BucketAlreadyOwnedByYou,
  CreateBucketCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PrismaClient } from 'db'
import { DocumentUploadInput } from 'shared'
import { PRISMA } from '../core/prisma/prisma.module'
import { s3Client, S3_BUCKET } from '../config/s3.client'

const PRESIGNED_URL_EXPIRY_SECONDS = 300

interface DocumentConfirmInput extends DocumentUploadInput {
  s3Key: string
}

@Injectable()
export class DocumentsService implements OnModuleInit {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async onModuleInit() {
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET }))
    } catch (error) {
      if (
        !(error instanceof BucketAlreadyOwnedByYou) &&
        !(error instanceof BucketAlreadyExists)
      ) {
        throw error
      }
    }
  }

  async createUploadUrl(userId: string, input: DocumentUploadInput) {
    const s3Key = `${userId}/${input.type}/${randomUUID()}`
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      ContentType: input.mimeType,
    })
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: PRESIGNED_URL_EXPIRY_SECONDS,
    })

    return { uploadUrl, s3Key }
  }

  async confirm(userId: string, input: DocumentConfirmInput) {
    if (!input.s3Key.startsWith(`${userId}/`)) {
      throw new ForbiddenException('Invalid document key')
    }

    return this.prisma.document.create({
      data: {
        userId,
        type: input.type,
        s3Key: input.s3Key,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        status: 'pending',
      },
      select: {
        id: true,
        type: true,
        status: true,
        rejectionReason: true,
        createdAt: true,
      },
    })
  }

  async findAllForUser(userId: string) {
    const documents = await this.prisma.document.findMany({
      where: { userId },
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

    return Promise.all(
      documents.map(async (document) => ({
        id: document.id,
        type: document.type,
        status: document.status,
        rejectionReason: document.rejectionReason,
        createdAt: document.createdAt.toISOString(),
        downloadUrl: await this.presignDownloadUrl(document.s3Key),
      }))
    )
  }

  presignDownloadUrl(s3Key: string): Promise<string> {
    return getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: S3_BUCKET, Key: s3Key }),
      { expiresIn: PRESIGNED_URL_EXPIRY_SECONDS }
    )
  }
}
