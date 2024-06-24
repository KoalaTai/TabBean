import { Configuration, OpenAIApi } from 'openai';
import { Client } from '@elastic/elasticsearch';

class KnowledgeBaseGenerator {
  constructor() {
    this.openai = new OpenAIApi(new Configuration({ apiKey: 'your-openai-api-key' }));
    this.esClient = new Client({ node: 'http://localhost:9200' });
  }

  async generateSummary(text) {
    const response = await this.openai.createCompletion({
      model: 'text-davinci-002',
      prompt: `Summarize the following text:\n\n${text}`,
      max_tokens: 150
    });
    return response.data.choices[0].text.trim();
  }

  async indexDocument(doc) {
    await this.esClient.index({
      index: 'knowledge-base',
      body: doc
    });
  }

  async searchKnowledgeBase(query) {
    const result = await this.esClient.search({
      index: 'knowledge-base',
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['title', 'content', 'summary']
          }
        }
      }
    });
    return result.body.hits.hits;
  }
}

export default new KnowledgeBaseGenerator();
