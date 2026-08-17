'use client'

import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { DocumentType } from 'shared'
import { cn } from '@/lib/utils'

const ACCEPTED_FILE_EXTENSIONS = '.pdf,.jpg,.jpeg,.png'

interface DocumentUploadDropzoneProps {
  documentType: DocumentType
  isUploading: boolean
  onFileSelected: (file: File, documentType: DocumentType) => void
}

export function DocumentUploadDropzone({
  documentType,
  isUploading,
  onFileSelected,
}: DocumentUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDraggingOver(true)
  }

  function handleDragLeave() {
    setIsDraggingOver(false)
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDraggingOver(false)
    if (isUploading) return
    const file = event.dataTransfer.files[0]
    if (file) {
      onFileSelected(file, documentType)
    }
  }

  function handleZoneClick() {
    if (isUploading) return
    inputRef.current?.click()
  }

  function handleZoneKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleZoneClick()
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      onFileSelected(file, documentType)
    }
    event.target.value = ''
  }

  return (
    <div
      role="button"
      aria-disabled={isUploading}
      tabIndex={0}
      onClick={handleZoneClick}
      onKeyDown={handleZoneKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/40 px-6 py-12 text-center transition-colors',
        isDraggingOver && 'border-brand-gold bg-brand-gold-soft/40',
        isUploading && 'cursor-not-allowed opacity-60'
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-brand-gold-soft text-brand-ink">
        <UploadCloud className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">
          {isUploading
            ? 'Uploading…'
            : 'Drag and drop a file, or click to browse'}
        </p>
        <p className="text-xs text-muted-foreground">
          PDF, JPG or PNG, up to 10MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_EXTENSIONS}
        disabled={isUploading}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  )
}
