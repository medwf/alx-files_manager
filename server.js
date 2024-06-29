import express from 'express';
import routes from './routes';

const app = express();
app.use(express.json());

app.listen(5000, () => {
  console.log('Server running on localhost port 5000 ... ');
});
routes(app);
export default app;
