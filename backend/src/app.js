const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv).config();

const auditRoutes = require('./routes/auditRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGDB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB, err));

app.use('/api/audits', auditRoutes);

app.listen(PORT, () => {
  console.log(`Server is srnning on port ${PORT});
});
