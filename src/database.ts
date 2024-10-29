import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Blog } from './blog/blog.entity';
import { Comment } from './comment/comment.entity';
import { BlogLikes } from './blog/blogLikes.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  entities: [User, Blog, Comment, BlogLikes],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((error) => console.log('Database connection failed', error));

export default AppDataSource;
