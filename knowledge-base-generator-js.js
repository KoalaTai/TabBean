import { Configuration, OpenAIApi } from 'openai';
import { Client } from '@elastic/elasticsearch';
import config from '../config';

class KnowledgeBaseGenerator {
  constructor() {
    this.openai = new OpenAIApi(new Configuration({ apiKey: config.openAiApiKey }));
    this.esClient = new Client({ node: config.elasticsearchNode });
  }

  async generateSummary(text) {
    try {
      const response = await this.openai.createCompletion({
        model: 'text-davinci-002',
        prompt: `Summarize the following text:\n\n${text}`,
        max_tokens: 150,
        temperature: 0.5,
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  async indexDocument(doc) {
    try {
      await this.esClient.index({
        index: 'knowledge-base',
        body: doc,
      });
    } catch (error) {
      console.error('Error indexing document:', error);
      throw error;
    }
  }

  async searchKnowledgeBase(query) {
    try {
      const result = await this.esClient.search({
        index: 'knowledge-base',
        body: {
          query: {
            multi_match: {
              query: query,
              fields: ['title', 'content', 'summary'],
            },
          },
        },
      });
      return result.body.hits.hits;
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      throw error;
    }
  }

  async processAndStoreContent(title, content, url) {
    try {
      const summary = await this.generateSummary(content);
      const doc = {
        title,
        content,
        summary,
        url,
        timestamp: new Date(),
      };
      await this.indexDocument(doc);
      return doc;
    } catch (error) {
      console.error('Error processing and storing content:', error);
      throw error;
    }
  }
}

export default new KnowledgeBaseGenerator();
