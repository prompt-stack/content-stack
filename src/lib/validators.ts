export function validateURL(url: string): boolean {
  try {
    new URL(url)
    return true
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