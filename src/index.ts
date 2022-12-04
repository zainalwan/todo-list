import { PORT } from './settings';
import { app } from './app';
import { dataSource } from './dataSource';

(async () => {
  await dataSource.initialize();
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
})();

