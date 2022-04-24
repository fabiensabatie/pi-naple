

import express from 'express';
import { OpenNDSController } from './adapters/controllers/opennds.controller';

const app = express();
const port = 80;

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log("MIDDlEWARE", req.query)
	next();
});
app.get('/', OpenNDSController);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});


