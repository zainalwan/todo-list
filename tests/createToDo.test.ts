import { Repository } from 'typeorm';
import { ToDo } from '../src/entities/toDo';
import { User } from '../src/entities/user';
import { app } from '../src/app';
import bcrypt from 'bcrypt';
import { dataSource } from '../src/dataSource';
import request from 'supertest';

describe('POST /todo', () => {
  let userRepo: Repository<User> = dataSource.getRepository(User);
  let toDoRepo: Repository<ToDo> = dataSource.getRepository(ToDo);
  let tom: User;

  beforeAll(async () => await dataSource.initialize());
  afterAll(async () => await dataSource.destroy());

  beforeEach(async () => {
    let salt = await bcrypt.genSalt(10);
    tom = new User();
    tom.firstName = 'Tom';
    tom.lastName = 'Cruise';
    tom.email = 'tomcruise@example.com';
    tom.password = await bcrypt.hash('tomcruisepassword', salt);
    await userRepo.save(tom);
  });
  afterEach(async () => {
    await toDoRepo.createQueryBuilder().delete().execute();
    await userRepo.createQueryBuilder().delete().execute();
  });

  it('do not login', async () => {
    let agent = request.agent(app);
    let response = await agent.post('/todo').send({
      name: 'Task 1',
      description: 'This is the task 1',
      dueDate: new Date(2022, 12, 10),
      assigneeId: tom.id,
    });

    expect(response.status).toBe(401);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.message).toBe('you must login first');
  });

  it('invalid payload', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'tomcruise@example.com',
      password: 'tomcruisepassword',
    });
    let response = await agent.post('/todo').send({});

    expect(response.status).toBe(400);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.errors.length).toBe(3);
  });

  it('valid payload', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'tomcruise@example.com',
      password: 'tomcruisepassword',
    });
    let response = await agent.post('/todo').send({
      name: 'Task 1',
      description: 'This is the task 1',
      dueDate: new Date(2022, 12, 10),
      assigneeId: tom.id,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
    expect((await toDoRepo.find()).length).toBe(1);
  });
});
