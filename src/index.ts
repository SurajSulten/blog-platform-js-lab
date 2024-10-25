import express from 'express';
import dotenv from 'dotenv';
import AppDataSource from './database';
import authRoutes from './routes/authRoutes';
import blogRouter from './blog/blog.routes';
import { commentRouter } from './comment/comment.routes';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/blogs', blogRouter);
app.use('/', commentRouter);

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));

export default app;