import 'reflect-metadata';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mydb',
  entities: [],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((error) => console.log('Database connection failed', error));

export default AppDataSource;
