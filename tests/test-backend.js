const express = require('express');
const app = express();
app.get('/test', (req, res) => res.json({ status: 'ok' }));
app.listen(3457, () => console.log('Test server on 3457'));
EOF && node test-backend.js & < /dev/null