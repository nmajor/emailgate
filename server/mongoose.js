import mongoose from 'mongoose';

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = Promise;

export default mongoose;
