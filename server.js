const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/v1', require('./router'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
});