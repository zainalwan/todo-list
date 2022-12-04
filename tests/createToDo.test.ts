import { LOGIN_COOKIE_KEY } from '../src/settings';
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
  let john: User;

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

    salt = await bcrypt.genSalt(10);
    john = new User();
    john.firstName = 'John';
    john.lastName = 'Doe';
    john.email = 'johndoe@example.com';
    john.password = await bcrypt.hash('johndoepassword', salt);
    await userRepo.save(john);
  });
  afterEach(async () => {
    await toDoRepo.createQueryBuilder().delete().execute();
    await userRepo.createQueryBuilder().delete().execute();
  });

  it('do not login', async () => {
    let response = await request(app).post('/todo').send({
      name: 'Task 1',
      description: 'This is the task 1',
      dueDate: new Date(2022, 12, 10),
      assigneeId: tom.id,
    });

    expect(response.status).toBe(401);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.message).toBe('you must login first');
  });

  it('invalid JWT', async () => {
    let response = await request(app).post('/todo')
      .set('Cookie', [`${LOGIN_COOKIE_KEY}=invalidjwt`])
      .send({
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
    expect(response.body.data.errors.length).toBe(4);
  });

  it('assignee not found', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'tomcruise@example.com',
      password: 'tomcruisepassword',
    });
    let response = await agent.post('/todo').send({
      name: 'Task 1',
      description: 'This is the task 1',
      dueDate: new Date(2022, 12, 10),
      status: 'inbox',
      assigneeId: john.id + 100,
    });

    expect(response.status).toBe(400);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.errors.length).toBe(1);
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
      status: 'inbox',
      assigneeId: john.id,
    });
    let toDos = await toDoRepo.find();

    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
    expect(toDos.length).toBe(1);
    expect(toDos[0].assigneeId).toEqual(john);
    expect(toDos[0].creatorId).toEqual(tom);
  });
});
