const mongoose = require('mongoose');
const { sampleUsers } = require('../data/sampleData');

let isConnected = false;
let inMemorySkills = [];
let inMemoryUsers = JSON.parse(JSON.stringify(sampleUsers));

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log('\n--------------------------------------------------------------');
    console.log(' [Skill Swap DB] Notice: MONGODB_URI not set.');
    console.log(' -> Running in Local In-Memory Mode.');
    console.log(' -> To connect to Cloud MongoDB Atlas, add MONGODB_URI to server/.env');
    console.log('--------------------------------------------------------------\n');

    isConnected = false;
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });

    isConnected = true;

    console.log(
      `\n [Skill Swap DB] Successfully connected to MongoDB Cloud: ${conn.connection.host}`
    );

  } catch (error) {
    console.error(
      'MONGODB_CONNECTION_ERROR:',
      error.message
    );

    console.warn(
      ' -> Automatically falling back to Local In-Memory Mode.'
    );

    isConnected = false;
  }
};

const getStatus = () => ({
  cloudConnected: isConnected,
  mode: isConnected ? 'Cloud MongoDB' : 'In-Memory Demo Mode'
});

module.exports = {
  connectDB,
  getStatus,
  inMemorySkills,
  inMemoryUsers
};