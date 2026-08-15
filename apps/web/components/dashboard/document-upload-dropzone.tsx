'use client'

import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

function handleFileSelected(file: File): void {
  // TODO: upload file to the documents API
}

export function DocumentUploadDropzone() {
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
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileSelected(file)
    }
  }

  function handleZoneClick() {
    inputRef.current?.click()
  }

  function handleZoneKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      inputRef.current?.click()
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelected(file)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleZoneClick}
      onKeyDown={handleZoneKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/40 px-6 py-12 text-center transition-colors',
        isDraggingOver && 'border-brand-gold bg-brand-gold-soft/40'
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-brand-gold-soft text-brand-ink">
        <UploadCloud className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">
          Drag and drop a file, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          PDF, JPG or PNG, up to 10MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  )
}
