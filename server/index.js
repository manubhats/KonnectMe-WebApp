import http from 'http';
import express from 'express';
import api from './api';

var app = express();
app.server = http.createServer(app);

app.use(express.static('./client'));

// api router
app.use('/api', api());

app.server.listen(process.env.PORT || 8080);

console.log(`Started on port ${app.server.address().port}`);

export default app;