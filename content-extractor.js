import { Readability } from '@mozilla/readability';
import YouTubeTranscript from 'youtube-transcript';

class ContentExtractor {
  extractWebContent(doc) {
    const reader = new Readability(doc);
    return reader.parse();
  }

  async extractYouTubeTranscript(videoId) {
    try {
      const transcript = await YouTubeTranscript.fetchTranscript(videoId);
      return transcript.map(item => item.text).join(' ');
    } catch (error) {
      console.error('Error extracting YouTube transcript:', error);
      return null;
    }
  }

  async extract(url, doc) {
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return await this.extractYouTubeTranscript(videoId);
    } else {
      return this.extractWebContent(doc);
    }
  }
}

export default new ContentExtractor();
