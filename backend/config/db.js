import dns from 'dns';
import mongoose from 'mongoose';

// Prefer the platform DNS configuration on Vercel.
// For local Windows environments where SRV DNS can fail, public resolvers
// are still available through the MONGO_DNS_SERVERS environment variable.
if (process.env.MONGO_DNS_SERVERS) {
  dns.setServers(
    process.env.MONGO_DNS_SERVERS
      .split(',')
      .map((server) => server.trim())
      .filter(Boolean)
  );
}

let connectionPromise;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MongoDB connection string is missing. Set MONGO_URI (or MONGODB_URI) in the Vercel Production environment.'
    );
  }

  connectionPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 5,
    maxIdleTimeMS: 60000
  });

  try {
    await connectionPromise;
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    connectionPromise = undefined;
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}
