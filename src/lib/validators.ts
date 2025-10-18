/**
 * @file lib/validators.ts
 * @purpose [TODO: Add purpose]
 * @layer unknown
 * @deps none
 * @used-by [Dropzone]
 * @css none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role utility
 */

export function validateURL(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

export function extractVideoId(url: string): string | null {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  if (youtubeMatch) return youtubeMatch[1]
  
  // TikTok
  const tiktokMatch = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/)
  if (tiktokMatch) return tiktokMatch[1]
  
  return null
}

export function detectPlatform(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('tiktok.com')) return 'tiktok'
  if (url.includes('reddit.com')) return 'reddit'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter'
  return 'article'
}

export function validateFileType(file: File, acceptedTypes: string[]): boolean {
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  return acceptedTypes.some(type => type.toLowerCase() === extension)
}

export function validateFileSize(file: File, maxSizeInBytes: number): boolean {
  return file.size <= maxSizeInBytes
}
