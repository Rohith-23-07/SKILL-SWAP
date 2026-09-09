const mongoose = require('mongoose');
const { sampleSkills, sampleUsers } = require('../data/sampleData');

let isConnected = false;
let inMemorySkills = JSON.parse(JSON.stringify(sampleSkills));
let inMemoryUsers = JSON.parse(JSON.stringify(sampleUsers));

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log('\n--------------------------------------------------------------');
    console.log(' [Skill Swap DB] Notice: MONGODB_URI not set.');
    console.log(' -> Running in Local In-Memory Mode with sample student data.');
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

    // Seed initial data if MongoDB collections are empty
    try {
      const Skill = require('../models/Skill');
      const count = await Skill.countDocuments();

      if (count === 0) {
        console.log(
          ' [Skill Swap DB] Seeding initial sample skills to Cloud Database...'
        );

        await Skill.insertMany(
          sampleSkills.map(s => {
            const { id, ...rest } = s;
            return rest;
          })
        );

        console.log(
          ' [Skill Swap DB] Initial sample skills seeded successfully!'
        );
      }
    } catch (seedErr) {
      console.warn(
        ' [Skill Swap DB] Warning during initial seed:',
        seedErr.message
      );
    }

  } catch (error) {
    // Show the actual MongoDB connection error
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