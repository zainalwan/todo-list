import { Repository } from 'typeorm';
import { ToDo } from '../src/entities/toDo';
import { User } from '../src/entities/user';
import { app } from '../src/app';
import bcrypt from 'bcrypt';
import { dataSource } from '../src/dataSource';
import request from 'supertest';

describe('GET /todo', () => {
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

    await toDoRepo.insert([
      {
        name: 'Task 1',
        description: 'This is 1st task',
        dueDate: new Date(2022, 12, 10),
        status: 'inbox',
        assigneeId: john,
        creatorId: tom,
      },
      {
        name: 'Task 2',
        description: 'This is 2nd task',
        dueDate: new Date(2022, 12, 11),
        status: 'inbox',
        assigneeId: john,
        creatorId: tom,
      },
      {
        name: 'Task 3',
        description: 'This is 3rd task',
        dueDate: new Date(2022, 12, 12),
        status: 'inbox',
        assigneeId: tom,
        creatorId: tom,
      },
      {
        name: 'Task 4',
        description: 'This is 4th task',
        dueDate: new Date(2022, 12, 13),
        status: 'inbox',
        assigneeId: tom,
        creatorId: tom,
      },
      {
        name: 'Task 5',
        description: 'This is 5th task',
        dueDate: new Date(2022, 12, 14),
        status: 'inbox',
        assigneeId: tom,
        creatorId: tom,
      },
    ]);
  });
  afterEach(async () => {
    await toDoRepo.createQueryBuilder().delete().execute();
    await userRepo.createQueryBuilder().delete().execute();
  });

  it('get unregistered assignee tasks', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'tomcruise@example.com',
      password: 'tomcruisepassword',
    });
    let response = await agent.get(`/todo?assignee_id=${tom.id + 100}`);

    expect(response.status).toBe(404);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.message).toBe('assignee not found');
  });

  it('invalid query parameter', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'tomcruise@example.com',
      password: 'tomcruisepassword',
    });
    let response = await agent.get('/todo?assignee_id=invalide');

    expect(response.status).toBe(404);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.message).toBe('assignee not found');
  });

  it('get tom tasks', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'tomcruise@example.com',
      password: 'tomcruisepassword',
    });
    let response = await agent.get(`/todo?assignee_id=${tom.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
    expect(response.body.data.toDos.length).toBe(3);
  });

  it('get john tasks', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'tomcruise@example.com',
      password: 'tomcruisepassword',
    });
    let response = await agent.get(`/todo?assignee_id=${john.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
    expect(response.body.data.toDos.length).toBe(2);
  });

  it('get all tasks', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'tomcruise@example.com',
      password: 'tomcruisepassword',
    });
    let response = await agent.get('/todo');

    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
    expect(response.body.data.toDos.length).toBe(5);
  });
});
