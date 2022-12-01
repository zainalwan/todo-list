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
    let john: User = new User();
    john.firstName = 'John';
    john.lastName = 'Doe';
    john.email = 'johndoe@example.com';
    john.password = await bcrypt.hash('johndoepassword', salt);
    await userRepo.save(john);
  });
  afterEach(async () => await userRepo.clear());

  it('invalid payload', async () => {
    let response = await request(app).post('/login').send({});
    expect(response.status).toBe(400);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.errors.length).toBe(2);
  });

  it('unregistered email', async () => {
    let response = await request(app).post('/login').send({
      email: 'wrongjohndoe@example.com',
      password: 'johndoepassword',
    });
    expect(response.status).toBe(400);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.errors.length).toBe(1);
    expect(response.body.data.errors[0].field).toBe('email');
  });

  it('wrong password', async () => {
    let response = await request(app).post('/login').send({
      email: 'johndoe@example.com',
      password: 'wrongjohndoepassword',
    });
    expect(response.status).toBe(400);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.errors.length).toBe(1);
    expect(response.body.data.errors[0].field).toBe('password');
  });

  it('valid credential', async () => {
    let response = await request(app).post('/login').send({
      email: 'johndoe@example.com',
      password: 'johndoepassword',
    });
    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
    expect(response.headers['set-cookie'][0]).toMatch(LOGIN_COOKIE_KEY);
  });
});