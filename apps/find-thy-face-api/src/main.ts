import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { knex } from 'knex';

import register from './controllers/register';
import signin from './controllers/signin';
import profile from './controllers/profile';
import image from './controllers/image';

// Load .env
config();

const PORT = process.env.PORT;

const db = knex({
  client: 'pg',
  connection: {
    // connectionString: process.env.DATABASE_URL,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
    // Uncomment for local development
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    
  },
});

db.select('*').from('users');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  //res.send(database.users);
  res.send('success');
});

app.post('/signin', (req: Request, res: Response) => {
  signin.handleSignin(req, res, db);
});
app.post('/register', (req: Request, res: Response) => {
  register.handleRegister(req, res, db);
});
app.get('/profile/:id', (req: Request, res: Response) => {
  profile.handleProfile(req, res, db);
});
app.put('/entries', (req: Request, res: Response) => {
  image.handleEntry(req, res, db);
});

const server = app.listen(PORT || 3000, () => {
  console.log(`app is runnning on port ${PORT}`);
});

server.on('error', (e: Error) =>
  console.error(e.name, e.message, e.stack || '')
);

server.on('close', () => console.log('Server closes.'));

/*
/--> res = this is running
/sigin --> POST = success/fail
/register --> POST = user
/profiles/:uerId --> GET = user
/image --> PUT --> user
*/
