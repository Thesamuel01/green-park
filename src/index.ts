import App from './app';
import 'dotenv/config';

const PORT = process.env.NODE_PORT ?? 4000;

new App().start(PORT);
