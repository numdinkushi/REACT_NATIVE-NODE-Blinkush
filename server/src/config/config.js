import 'dotenv/config';
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from 'connect-mongodb-session';
import { Admin } from '../models/index.js';

const MongoDBStore = ConnectMongoDBSession(fastifySession);

// export const sessionStore = new MongoDBStore({
//     uri: process.env.MONGO_URI,
//     collection: 'sessions',
// });

export const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions',
    connectionOptions: {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000, // 60 seconds timeout
      socketTimeoutMS: 60000, // 60 seconds timeout
    },
  });
  
sessionStore.on("error", (error) => {
    console.log('session store error', error);
});

export const authenticate = async (email, password) => {
    if (email === 'numdinkushi@gmail.com' && password === '12345678') {
        return Promise.resolve({ email, password });
    } else {
        return null;
    }
};

export const PORT = process.env.PORT || 4000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD