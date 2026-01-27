import express from 'express';
import routes from './routes';

const app = express();
app.use(express.json());

const PORT = process.env.EXPRESS_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on localhost port ${PORT} ... `);
});

routes(app);
export default app;
