import { dataSource } from '../src/dataSource';

describe('data source connection', () => {
  it('should connect', async () => {
    await dataSource.initialize();
    expect(dataSource.isInitialized).toBe(true);
    await dataSource.destroy();
  });
});
