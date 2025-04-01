const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/tasks');
const collectionRoutes = require('./routes/collections');

dotenv.config();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.use('/api/auth', authRoutes); 
app.use('/api/user', require('./routes/user')); 

app.use('/api/user', userRoutes);     
app.use('/api/tasks', taskRoutes);
app.use('/api/collections', collectionRoutes);

app.listen(PORT, () => console.log('Server running on port 5000'));
