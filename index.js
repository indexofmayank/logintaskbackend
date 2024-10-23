require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDb = require('./config/db');

const userRouter = require('./routers/userRouter');

const app = express();
app.use(cookieParser());

connectToDb();
app.use(cors());
app.use(express.json());

app.use('/api/user/', userRouter)

app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'it working'
    });
});

app.listen(process.env.PORT || 5000, () => {
    console.log('app is working on 5000');
})