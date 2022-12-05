import { Repository } from 'typeorm';
import { ToDo } from '../src/entities/toDo';
import { User } from '../src/entities/user';
import { app } from '../src/app';
import bcrypt from 'bcrypt';
import { dataSource } from '../src/dataSource';
import request from 'supertest';

describe('PUT /todo/:id', () => {
  let userRepo: Repository<User> = dataSource.getRepository(User);
  let toDoRepo: Repository<ToDo> = dataSource.getRepository(ToDo);
  let tom: User;
  let john: User;
  let task1: ToDo;

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

    task1 = new ToDo();
    task1.name = 'Task 1';
    task1.description = 'This is 1st task';
    task1.dueDate = new Date(2022, 12, 10);
    task1.status = 'inbox';
    task1.assigneeId = john;
    task1.creatorId = tom;
    await toDoRepo.save(task1);
  });
  afterEach(async () => {
    await toDoRepo.createQueryBuilder().delete().execute();
    await userRepo.createQueryBuilder().delete().execute();
  });

  it('creator changes status invalid', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'tomcruise@example.com',
      password: 'tomcruisepassword',
    });
    let response = await agent.put(`/todo/${task1.id}`).send({
      status: 'invalid status',
    });

    expect(response.status).toBe(400);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.errors.length).toBe(1);
    expect((await toDoRepo.findOneByOrFail({ id: task1.id })).status)
      .toBe('inbox');
  });

  it('creator changes status & description valid', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'tomcruise@example.com',
      password: 'tomcruisepassword',
    });
    let response = await agent.put(`/todo/${task1.id}`).send({
      status: 'ongoing',
      description: 'Changed desc',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
    expect(response.body.data.toDo.status).toBe('ongoing');
    expect(response.body.data.toDo.description).toBe('Changed desc');

    let task1New = await toDoRepo.findOneByOrFail({ id: task1.id });
    expect(task1New.status).toBe('ongoing');
    expect(task1New.description).toBe('Changed desc');

    response = await agent.put(`/todo/${task1.id}`).send({});

    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
    expect(response.body.data.toDo.status).toBe('ongoing');
    expect(response.body.data.toDo.description).toBe('Changed desc');

    task1New = await toDoRepo.findOneByOrFail({ id: task1.id });
    expect(task1New.status).toBe('ongoing');
    expect(task1New.description).toBe('Changed desc');

    response = await agent.put(`/todo/${task1.id}`).send({ description: '', });

    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
    expect(response.body.data.toDo.description).toBe('');

    task1New = await toDoRepo.findOneByOrFail({ id: task1.id });
    expect(task1New.description).toBe('');
  });
});
