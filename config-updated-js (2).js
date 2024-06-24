module.exports = {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost/secure-tab-manager',
  redisUri: process.env.REDIS_URI || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  openAiApiKey: process.env.OPENAI_API_KEY,
  elasticsearchNode: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  encryptionKey: process.env.ENCRYPTION_KEY || 'your-very-secure-encryption-key'
};
