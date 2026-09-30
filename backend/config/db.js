import dns from 'dns';
import mongoose from 'mongoose';

// Use public DNS resolvers for MongoDB SRV lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
