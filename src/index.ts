import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import { router } from 'express-file-routing';

import path from 'path';
import { fileURLToPath } from 'url';

import middleware from './middleware.js';
import passport from 'passport';
import { configure } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '30mb', verify: (req, res, buf) => {
    req.rawBody = buf
}}));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'))
app.use(cors({
    origin: ["https://app.moirai.nz"]
}));

app.use('/', await router({
    directory: path.join(__dirname, 'routes')
}));

app.use(passport.initialize());
configure();

app.use(middleware);

const port = process.env.PORT || 5000
app.listen(port);