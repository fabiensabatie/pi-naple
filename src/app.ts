

import express from 'express';
import { OpenNDSController } from './adapters/controllers/opennds.controller';

const app = express();
const port = 8010;

app.get('/', OpenNDSController);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});


