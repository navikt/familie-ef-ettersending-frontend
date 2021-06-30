import express from 'express';
import path from 'path';
import fs from 'fs';

const delayMs = 500;
const app = express();
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

const lesMockFil = (filnavn) => {
    try {
        return fs.readFileSync(path.join(__dirname, '/mock/' + filnavn), 'UTF-8');
    } catch (err) {
        throw err;
    }
};

app.get('/hallo', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`test-1.json`)), delayMs);
});

export default app;