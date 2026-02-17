import request from 'supertest';
import app from '../tests/server';
import Project from '../src/models/Project';
import Task from '../src/models/Task';
import { taskStatus } from '../src/models/Task';

const validProject = {
  projectName: 'Test Project',
  clientName: 'Test Client',
  description: 'This is a test project description',
};

const validTask = {
  name: 'Test Task',
  description: 'This is a test task description',
};

const invalidId = '507f1f77bcf86cd799439011';
const nonMongoId = 'not-a-valid-id';

describe('Tasks API', () => {
  let project: any;

  beforeEach(async () => {
    project = await Project.create(validProject);
  });

  describe('GET /api/projects/:projectId/tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const res = await request(app).get(`/api/projects/${project._id}/tasks`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(app).get(`/api/projects/${invalidId}/tasks`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Proyecto no encontrado');
    });

    it('should return 500 for invalid MongoDB ID format', async () => {
      const res = await request(app).get(`/api/projects/${nonMongoId}/tasks`);
      expect(res.status).toBe(500);
    });

    it('should return all tasks for a project', async () => {
      await request(app).post(`/api/projects/${project._id}/tasks`).send(validTask);
      await request(app).post(`/api/projects/${project._id}/tasks`).send({ name: 'Second Task', description: 'Second task description here' });
      
      const res = await request(app).get(`/api/projects/${project._id}/tasks`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('should return tasks with all fields', async () => {
      await Task.create({ ...validTask, project: project._id });
      
      const res = await request(app).get(`/api/projects/${project._id}/tasks`);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('description');
      expect(res.body[0]).toHaveProperty('status');
      expect(res.body[0]).toHaveProperty('project');
    });

    it('should return tasks with default status pending', async () => {
      await Task.create({ ...validTask, project: project._id });
      
      const res = await request(app).get(`/api/projects/${project._id}/tasks`);
      expect(res.body[0].status).toBe(taskStatus.PENDING);
    });
  });

  describe('POST /api/projects/:projectId/tasks', () => {
    it('should create task with valid data', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send(validTask);
      expect(res.status).toBe(200);
      expect(res.text).toBe('Tarea Creada Correctamente');
    });

    it('should create task and link to project', async () => {
      await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send(validTask);
      
      const updatedProject = await Project.findById(project._id);
      expect(updatedProject?.tasks.length).toBe(1);
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(app)
        .post(`/api/projects/${invalidId}/tasks`)
        .send(validTask);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Proyecto no encontrado');
    });

    it('should return 400 for invalid MongoDB ID format', async () => {
      const res = await request(app)
        .post(`/api/projects/${nonMongoId}/tasks`)
        .send(validTask);
      expect(res.status).toBe(400);
    });

    it('should return 400 when name is missing', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send({ description: 'Description' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when description is missing', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send({ name: 'Task Name' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when name is too short', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send({ name: 'ab', description: 'Description' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when description is too short', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send({ name: 'Task Name', description: 'Short' });
      expect(res.status).toBe(400);
    });

    it('should trim whitespace from name', async () => {
      await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send({ name: '  Test Task  ', description: 'This is a test task description' });
      
      const task = await Task.findOne({ name: 'Test Task' });
      expect(task).not.toBeNull();
    });

    it('should create task with default pending status', async () => {
      await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send(validTask);
      
      const task = await Task.findOne({ name: 'Test Task' });
      expect(task?.status).toBe(taskStatus.PENDING);
    });

    it('should create multiple tasks for same project', async () => {
      await request(app).post(`/api/projects/${project._id}/tasks`).send(validTask);
      await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send({ name: 'Second Task', description: 'Second task description here' });
      
      const tasks = await Task.find({ project: project._id });
      expect(tasks.length).toBe(2);
    });
  });

  describe('GET /api/projects/:projectId/tasks/:taskId', () => {
    let task: any;

    beforeEach(async () => {
      task = await Task.create({ ...validTask, project: project._id });
    });

    it('should return task by ID', async () => {
      const res = await request(app).get(`/api/projects/${project._id}/tasks/${task._id}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test Task');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app).get(`/api/projects/${project._id}/tasks/${invalidId}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Tarea no encontrado');
    });

    it('should return 500 for invalid task ID format', async () => {
      const res = await request(app).get(`/api/projects/${project._id}/tasks/${nonMongoId}`);
      expect(res.status).toBe(500);
    });

    it('should return 404 when task belongs to different project', async () => {
      const otherProject = await Project.create({ ...validProject, projectName: 'Other Project' });
      const otherTask = await Task.create({ ...validTask, project: otherProject._id });
      
      const res = await request(app).get(`/api/projects/${project._id}/tasks/${otherTask._id}`);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Acción no válida');
    });

    it('should return task with populated project', async () => {
      const res = await request(app).get(`/api/projects/${project._id}/tasks/${task._id}`);
      expect(res.status).toBe(200);
      expect(res.body.project).toBeDefined();
    });
  });

  describe('PUT /api/projects/:projectId/tasks/:taskId', () => {
    let task: any;

    beforeEach(async () => {
      task = await Task.create({ ...validTask, project: project._id });
    });

    it('should update task', async () => {
      const res = await request(app)
        .put(`/api/projects/${project._id}/tasks/${task._id}`)
        .send({ name: 'Updated Task', description: 'Updated description' });
      expect(res.status).toBe(200);
      expect(res.text).toBe('Tarea actualizada correctamente');
      
      const updatedTask = await Task.findById(task._id);
      expect(updatedTask?.name).toBe('Updated Task');
      expect(updatedTask?.description).toBe('Updated description');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .put(`/api/projects/${project._id}/tasks/${invalidId}`)
        .send({ name: 'Updated Task' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Tarea no encontrado');
    });

    it('should return 500 for invalid task ID format', async () => {
      const res = await request(app)
        .put(`/api/projects/${project._id}/tasks/${nonMongoId}`)
        .send({ name: 'Updated Task' });
      expect(res.status).toBe(500);
    });

    it('should return 404 when task belongs to different project', async () => {
      const otherProject = await Project.create({ ...validProject, projectName: 'Other Project' });
      const otherTask = await Task.create({ ...validTask, project: otherProject._id });
      
      const res = await request(app)
        .put(`/api/projects/${project._id}/tasks/${otherTask._id}`)
        .send({ name: 'Updated Task' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Acción no válida');
    });

    it('should update only name', async () => {
      const res = await request(app)
        .put(`/api/projects/${project._id}/tasks/${task._id}`)
        .send({ name: 'New Name', description: validTask.description });
      expect(res.status).toBe(200);
      
      const updatedTask = await Task.findById(task._id);
      expect(updatedTask?.name).toBe('New Name');
      expect(updatedTask?.description).toBe(validTask.description);
    });

    it('should update only description', async () => {
      const res = await request(app)
        .put(`/api/projects/${project._id}/tasks/${task._id}`)
        .send({ name: validTask.name, description: 'New description' });
      expect(res.status).toBe(200);
      
      const updatedTask = await Task.findById(task._id);
      expect(updatedTask?.name).toBe(validTask.name);
      expect(updatedTask?.description).toBe('New description');
    });

    it('should return 400 when name is too short', async () => {
      const res = await request(app)
        .put(`/api/projects/${project._id}/tasks/${task._id}`)
        .send({ name: 'ab' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when description is too short', async () => {
      const res = await request(app)
        .put(`/api/projects/${project._id}/tasks/${task._id}`)
        .send({ description: 'Short' });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/projects/:projectId/tasks/:taskId', () => {
    let task: any;

    beforeEach(async () => {
      task = await Task.create({ ...validTask, project: project._id });
    });

    it('should delete task', async () => {
      const res = await request(app).delete(`/api/projects/${project._id}/tasks/${task._id}`);
      expect(res.status).toBe(200);
      expect(res.text).toBe('Tarea eliminada correctamente');
      
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it('should remove task from project tasks array', async () => {
      await request(app).delete(`/api/projects/${project._id}/tasks/${task._id}`);
      
      const updatedProject = await Project.findById(project._id);
      expect(updatedProject?.tasks.length).toBe(0);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app).delete(`/api/projects/${project._id}/tasks/${invalidId}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Tarea no encontrado');
    });

    it('should return 500 for invalid task ID format', async () => {
      const res = await request(app).delete(`/api/projects/${project._id}/tasks/${nonMongoId}`);
      expect(res.status).toBe(500);
    });

    it('should return 404 when task belongs to different project', async () => {
      const otherProject = await Project.create({ ...validProject, projectName: 'Other Project' });
      const otherTask = await Task.create({ ...validTask, project: otherProject._id });
      
      const res = await request(app).delete(`/api/projects/${project._id}/tasks/${otherTask._id}`);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Acción no válida');
    });

    it('should delete only the specified task', async () => {
      const task2 = await Task.create({ ...validTask, name: 'Task 2', project: project._id });
      
      await request(app).delete(`/api/projects/${project._id}/tasks/${task._id}`);
      
      const remainingTask = await Task.findById(task2._id);
      expect(remainingTask).not.toBeNull();
      
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });
  });

  describe('POST /api/projects/:projectId/tasks/:taskId/status', () => {
    let task: any;

    beforeEach(async () => {
      task = await Task.create({ ...validTask, project: project._id });
    });

    it('should update task status', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks/${task._id}/status`)
        .send({ status: taskStatus.IN_PROGRESS });
      expect(res.status).toBe(200);
      expect(res.text).toBe('Estado de tarea actualizado correctamente');
      
      const updatedTask = await Task.findById(task._id);
      expect(updatedTask?.status).toBe(taskStatus.IN_PROGRESS);
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks/${task._id}/status`)
        .send({ status: 'invalid_status' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Estado de tarea inválido');
    });

    it('should update to all valid statuses', async () => {
      const statuses = [
        taskStatus.ON_HOLD,
        taskStatus.IN_PROGRESS,
        taskStatus.UNDER_REVIEW,
        taskStatus.COMPLETED,
      ];

      for (const status of statuses) {
        const res = await request(app)
          .post(`/api/projects/${project._id}/tasks/${task._id}/status`)
          .send({ status });
        expect(res.status).toBe(200);
      }
    });

    it('should return 400 when status is missing', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks/${task._id}/status`)
        .send({});
      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks/${invalidId}/status`)
        .send({ status: taskStatus.IN_PROGRESS });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Tarea no encontrado');
    });

    it('should return 500 for invalid task ID format', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks/${nonMongoId}/status`)
        .send({ status: taskStatus.IN_PROGRESS });
      expect(res.status).toBe(500);
    });

    it('should return 404 when task belongs to different project', async () => {
      const otherProject = await Project.create({ ...validProject, projectName: 'Other Project' });
      const otherTask = await Task.create({ ...validTask, project: otherProject._id });
      
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks/${otherTask._id}/status`)
        .send({ status: taskStatus.IN_PROGRESS });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Acción no válida');
    });
  });

  describe('Validation Error Messages', () => {
    it('should return specific error for missing name', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send({ name: '', description: 'Description' });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should return specific error for short name', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send({ name: 'ab', description: 'Description' });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should return specific error for short description', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send({ name: 'Task Name', description: 'Short' });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long task name', async () => {
      const longName = 'a'.repeat(51);
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send({ name: longName, description: 'This is a test task description' });
      expect(res.status).toBe(400);
    });

    it('should handle valid maximum length task name', async () => {
      const maxName = 'a'.repeat(50);
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send({ name: maxName, description: 'This is a test task description' });
      expect(res.status).toBe(200);
    });

    it('should handle request with extra unknown fields', async () => {
      const res = await request(app)
        .post(`/api/projects/${project._id}/tasks`)
        .send({ ...validTask, extraField: 'ignored' });
      expect(res.status).toBe(200);
    });

    it('should handle update with empty body', async () => {
      const task = await Task.create({ ...validTask, project: project._id });
      const res = await request(app)
        .put(`/api/projects/${project._id}/tasks/${task._id}`)
        .send({});
      expect(res.status).toBe(400);
    });

    it('should handle concurrent task creation', async () => {
      const promises = [
        request(app).post(`/api/projects/${project._id}/tasks`).send(validTask),
        request(app)
          .post(`/api/projects/${project._id}/tasks`)
          .send({ name: 'Task 2', description: 'Second task description here' }),
        request(app)
          .post(`/api/projects/${project._id}/tasks`)
          .send({ name: 'Task 3', description: 'Third task description here' }),
      ];

      const results = await Promise.all(promises);
      results.forEach((res) => expect(res.status).toBe(200));

      const count = await Task.countDocuments({ project: project._id });
      expect(count).toBe(3);
    });
  });
});
