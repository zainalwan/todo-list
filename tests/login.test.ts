import { LOGIN_COOKIE_KEY } from '../src/settings';
import { Repository } from 'typeorm';
import { User } from '../src/entities/user';
import { app } from '../src/app';
import bcrypt from 'bcrypt';
import { dataSource } from '../src/dataSource';
import request from 'supertest';

describe('POST /login', () => {
  let userRepo: Repository<User> = dataSource.getRepository(User);

  beforeAll(async () => await dataSource.initialize());
  afterAll(async () => await dataSource.destroy());

  beforeEach(async () => {
    let salt = await bcrypt.genSalt(10);
    let david: User = new User();
    david.firstName = 'David';
    david.lastName = 'Park';
    david.email = 'davidpark@example.com';
    david.password = await bcrypt.hash('davidparkpassword', salt);
    await userRepo.save(david);
  });
  afterEach(async () => {
    await userRepo.createQueryBuilder().delete().execute();
  });

  it('invalid payload', async () => {
    let response = await request(app).post('/login').send({});
    expect(response.status).toBe(400);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.errors.length).toBe(2);
  });

  it('unregistered email', async () => {
    let response = await request(app).post('/login').send({
      email: 'wrongdavidpark@example.com',
      password: 'davidparkpassword',
    });
    expect(response.status).toBe(400);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.errors.length).toBe(1);
    expect(response.body.data.errors[0].field).toBe('email');
  });

  it('wrong password', async () => {
    let response = await request(app).post('/login').send({
      email: 'davidpark@example.com',
      password: 'wrongdavidparkpassword',
    });
    expect(response.status).toBe(400);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.errors.length).toBe(1);
    expect(response.body.data.errors[0].field).toBe('password');
  });

  it('valid credential', async () => {
    let response = await request(app).post('/login').send({
      email: 'davidpark@example.com',
      password: 'davidparkpassword',
    });
    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
    expect(response.headers['set-cookie'][0]).toMatch(LOGIN_COOKIE_KEY);
  });
});
