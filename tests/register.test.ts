import { Repository } from 'typeorm';
import { User } from '../src/entities/user';
import { app } from '../src/app';
import { dataSource } from '../src/dataSource';
import request from 'supertest';

describe('POST /register', () => {
  let userRepo: Repository<User> = dataSource.getRepository(User);

  beforeAll(async () => await dataSource.initialize());
  afterAll(async () => await dataSource.destroy());
  afterEach(async () => {
    await userRepo.createQueryBuilder().delete().execute();
  });

  it('invalid payload', async () => {
    let response = await request(app).post('/register').send({});
    expect(response.status).toBe(400);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.errors.length).toBe(4);
  });

  it('not unique email', async () => {
    let john: User = new User();
    john.firstName = 'John';
    john.lastName = 'Doe';
    john.email = 'johndoe@example.com';
    john.password = 'johndoepassword';
    await userRepo.save(john);

    let response = await request(app).post('/register').send({
      firstName: 'The Fake',
      lastName: 'John Doe',
      email: 'johndoe@example.com',
      password: 'thefakejohndoepassword',
    });

    expect(response.status).toBe(400);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.errors.length).toBe(1);
    expect(response.body.data.errors[0].field).toBe('email');
  });

  it('valid payload', async () => {
    let response = await request(app).post('/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'johndoepassword',
    });
    let users: User[] = await userRepo.find();

    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
    expect(response.body.data.user).not.toBeUndefined();
    expect(response.body.data.user.email).toBe('johndoe@example.com');
    expect(users.length).toBe(1);
    expect(users[0].password).not.toBe('johndoepassword');
  });
});
