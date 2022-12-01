import { Repository } from 'typeorm';
import { User } from '../src/entities/user';
import { app } from '../src/app';
import bcrypt from 'bcrypt';
import { dataSource } from '../src/dataSource';
import request from 'supertest';

describe('POST /logout', () => {
  let userRepo: Repository<User> = dataSource.getRepository(User);

  beforeAll(async () => await dataSource.initialize());
  afterAll(async () => await dataSource.destroy());

  beforeEach(async () => {
    let salt = await bcrypt.genSalt(10);
    let john: User = new User();
    john.firstName = 'Jason';
    john.lastName = 'Statham';
    john.email = 'jasonstatham@example.com';
    john.password = await bcrypt.hash('jasonstathampassword', salt);
    await userRepo.save(john);
  });
  afterEach(async () => await userRepo.clear());

  it('should logout', async () => {
    let agent = request.agent(app);

    await agent.post('/login').send({
      email: 'jasonstatham@example.com',
      password: 'jasonstathampassword',
    });

    let response = await agent.post('/logout');
    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
  });
});
