'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  DocumentStatus,
  DocumentType,
  DocumentUploadInput,
  documentUploadSchema,
} from 'shared'
import { apiFetch } from '@/config/api-client'

export const documentKeys = {
  all: ['documents'] as const,
}

export interface Document {
  id: string
  type: DocumentType
  status: DocumentStatus
  rejectionReason: string | null
  createdAt: string
  downloadUrl: string
}

interface ConfirmedDocument {
  id: string
  type: DocumentType
  status: DocumentStatus
  rejectionReason: string | null
  createdAt: string
}

interface UploadUrlResponse {
  uploadUrl: string
  s3Key: string
}

interface UploadDocumentInput {
  file: File
  type: DocumentType
}

function getDocuments() {
  return apiFetch<Document[]>('/documents')
}

function requestUploadUrl(input: DocumentUploadInput) {
  return apiFetch<UploadUrlResponse>('/documents/upload-url', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

async function putFileToUploadUrl(uploadUrl: string, file: File) {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'content-type': file.type },
  })
  if (!response.ok) {
    throw new Error('File upload failed')
  }
}

function confirmDocument(input: DocumentUploadInput & { s3Key: string }) {
  return apiFetch<ConfirmedDocument>('/documents/confirm', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

async function uploadDocument({ file, type }: UploadDocumentInput) {
  const parsed = documentUploadSchema.safeParse({
    type,
    mimeType: file.type,
    sizeBytes: file.size,
  })
  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ?? 'This file cannot be uploaded'
    )
  }

  const { uploadUrl, s3Key } = await requestUploadUrl(parsed.data)
  await putFileToUploadUrl(uploadUrl, file)
  return confirmDocument({ ...parsed.data, s3Key })
}

export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.all,
    queryFn: getDocuments,
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: documentKeys.all }),
  })
}
