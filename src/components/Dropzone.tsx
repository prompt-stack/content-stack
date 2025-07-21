/**
 * @layer composed
 * @description File drop zone component with drag-and-drop support
 * @dependencies Box, Text primitives, react-dropzone library
 * @cssFile /styles/components/dropzone.css
 * @className .dropzone
 * 
 * This is a COMPOSED component that combines primitives with the react-dropzone
 * library to create a file upload interface with validation and feedback.
 */

import { useCallback, useState, ReactNode } from 'react'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'
import { validateFileType, validateFileSize } from '@/lib/validators'
import { formatFileSize } from '@/lib/formatters'
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/constants'

interface DropzoneProps {
  onDrop: (files: File[]) => void
  isCompact?: boolean
  onExpandToggle?: () => void
  children?: ReactNode
}

export function Dropzone({ onDrop, isCompact, onExpandToggle, children }: DropzoneProps) {
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([])

  const handleDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    // Clear previous rejections
    setRejectedFiles([])

    // Process accepted files
    const validFiles: File[] = []
    const rejected: string[] = []

    acceptedFiles.forEach(file => {
      if (!validateFileType(file, ACCEPTED_FILE_TYPES)) {
        rejected.push(`${file.name}: File type not supported`)
      } else if (!validateFileSize(file, MAX_FILE_SIZE)) {
        rejected.push(`${file.name}: File too large (max ${formatFileSize(MAX_FILE_SIZE)})`)
      } else {
        validFiles.push(file)
      }
    })

    // Add any rejections from dropzone
    fileRejections.forEach(rejection => {
      rejected.push(`${rejection.file.name}: ${rejection.errors[0].message}`)
    })

    setRejectedFiles(rejected)
    
    if (validFiles.length > 0) {
      onDrop(validFiles)
    }

    // Clear rejections after 5 seconds
    if (rejected.length > 0) {
      setTimeout(() => setRejectedFiles([]), 5000)
    }
  }, [onDrop])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: handleDrop,
    accept: ACCEPTED_FILE_TYPES.reduce((acc, ext) => {
      // Convert file extensions to MIME types
      const mimeMap: Record<string, string> = {
        '.txt': 'text/plain',
        '.md': 'text/markdown',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.csv': 'text/csv',
        '.json': 'application/json',
        '.xml': 'application/xml',
        '.html': 'text/html'
      }
      if (mimeMap[ext]) {
        acc[mimeMap[ext]] = [ext]
      }
      return acc
    }, {} as Record<string, string[]>),
    maxSize: MAX_FILE_SIZE,
    noClick: !isCompact && !!children,
    noKeyboard: !isCompact && !!children
  })

  if (isCompact) {
    return (
      <div className="dropzone-compact">
        <div
          {...getRootProps()}
          className={clsx(
            'dropzone-compact-area',
            isDragActive && 'dropzone-compact-area--active',
            isDragReject && 'dropzone-compact-area--reject'
          )}
        >
          <input {...getInputProps()} />
          <i className="fas fa-cloud-upload-alt" />
          <span>Drop files here or click to browse</span>
        </div>
        {onExpandToggle && (
          <button
            type="button"
            onClick={onExpandToggle}
            className="dropzone-expand-btn"
          >
            <i className="fas fa-expand" />
          </button>
        )}
      </div>
    )
  }

  // Full page dropzone with children
  if (children) {
    return (
      <div 
        {...getRootProps()} 
        className={clsx('dropzone', isDragActive && 'dropzone--dragging')}
      >
        <input {...getInputProps()} />
        {children}
        {isDragActive && (
          <div className="dropzone-overlay">
            <div className="dropzone-overlay-content">
              <i className="fas fa-cloud-upload-alt dropzone-overlay-icon"></i>
              <p className="dropzone-overlay-text">Drop files here to upload</p>
            </div>
          </div>
        )}
        {rejectedFiles.length > 0 && (
          <div className="dropzone-errors" style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 10000 }}>
            {rejectedFiles.map((error, index) => (
              <p key={index} className="dropzone-error">
                <i className="fas fa-exclamation-circle" />
                {error}
              </p>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="dropzone">
      <div
        {...getRootProps()}
        className={clsx(
          'dropzone-area',
          isDragActive && 'dropzone-area--active',
          isDragReject && 'dropzone-area--reject'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="dropzone-content">
          <i className="fas fa-cloud-upload-alt dropzone-icon" />
          
          {isDragActive ? (
            <p className="dropzone-text">Drop the files here...</p>
          ) : (
            <>
              <p className="dropzone-text">
                Drag & drop files here, or click to select files
              </p>
              <p className="dropzone-hint">
                Supports: Images, Documents, Text files (Max {formatFileSize(MAX_FILE_SIZE)})
              </p>
            </>
          )}
        </div>
      </div>

      {rejectedFiles.length > 0 && (
        <div className="dropzone-errors">
          {rejectedFiles.map((error, index) => (
            <p key={index} className="dropzone-error">
              <i className="fas fa-exclamation-circle" />
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}