import { LOGIN_COOKIE_KEY } from '../src/settings';
import { Repository } from 'typeorm';
import { ToDo } from '../src/entities/toDo';
import { User } from '../src/entities/user';
import { app } from '../src/app';
import bcrypt from 'bcrypt';
import { dataSource } from '../src/dataSource';
import request from 'supertest';

describe('DELETE /todo/:id', () => {
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

  it('to do not found', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'johndoe@example.com',
      password: 'johndoepassword',
    });
    let response = await agent.delete(`/todo/${task1.id + 100}`);

    expect(response.status).toBe(404);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.message).toBe('to do not found');

    response = await agent.delete('/todo/moreinvalid');

    expect(response.status).toBe(404);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.message).toBe('to do not found');
  });

  it('not creator delete', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'johndoe@example.com',
      password: 'johndoepassword',
    });
    let response = await agent.delete(`/todo/${task1.id}`);

    expect(response.status).toBe(403);
    expect(response.body.data.success).toBe(false);
    expect(response.body.data.message)
      .toBe('only creator can manipulate to do');
  });

  it('creator delete', async () => {
    let agent = request.agent(app);
    await agent.post('/login').send({
      email: 'tomcruise@example.com',
      password: 'tomcruisepassword',
    });
    let response = await agent.delete(`/todo/${task1.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data.success).toBe(true);
    expect(response.body.data.toDo.id).toBe(task1.id);
    expect((await toDoRepo.find()).length).toBe(0);
    expect(await toDoRepo.findOneBy({ id: task1.id })).toBeNull();
  });
});
