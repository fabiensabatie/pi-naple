

import express from 'express';
import { OpenNDSController } from './adapters/controllers/opennds.controller';
import https from "https-localhost";

const app = express();
const port = 8010;

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


