import request from 'supertest';
import app from '../tests/server';
import Project from '../src/models/Project';

const validProject = {
  projectName: 'Test Project',
  clientName: 'Test Client',
  description: 'This is a test project description',
};

const invalidId = '507f1f77bcf86cd799439011';
const nonMongoId = 'not-a-valid-id';

describe('Projects API', () => {
  describe('GET /api/projects', () => {
    it('should return empty array when no projects exist', async () => {
      const res = await request(app).get('/api/projects');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all projects', async () => {
      await Project.create(validProject);
      const res = await request(app).get('/api/projects');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].projectName).toBe('Test Project');
    });

    it('should return projects with all fields', async () => {
      await Project.create(validProject);
      const res = await request(app).get('/api/projects');
      expect(res.body[0]).toHaveProperty('projectName');
      expect(res.body[0]).toHaveProperty('clientName');
      expect(res.body[0]).toHaveProperty('description');
      expect(res.body[0]).toHaveProperty('tasks');
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('createdAt');
    });
  });

  describe('POST /api/projects', () => {
    it('should create project with valid data', async () => {
      const res = await request(app).post('/api/projects').send(validProject);
      expect(res.status).toBe(200);
      expect(res.text).toBe('Proyecto Creado Correctamente');
    });

    it('should return 400 when projectName is missing', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ clientName: 'Client', description: 'Description' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when clientName is missing', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ projectName: 'Project', description: 'Description' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when description is missing', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ projectName: 'Project', clientName: 'Client' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when projectName is too short', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ projectName: 'ab', clientName: 'Client', description: 'Description' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when projectName is empty', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ projectName: '', clientName: 'Client', description: 'Description' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when description is too short', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ projectName: 'Project', clientName: 'Client', description: 'Short' });
      expect(res.status).toBe(400);
    });

    it('should trim whitespace from projectName', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ projectName: '  Test Project  ', clientName: 'Client', description: 'This is a test project description' });
      expect(res.status).toBe(200);
      const project = await Project.findOne({ projectName: 'Test Project' });
      expect(project).not.toBeNull();
    });

    it('should create project with all fields populated', async () => {
      await request(app).post('/api/projects').send(validProject);
      const project = await Project.findOne({ projectName: 'Test Project' });
      expect(project).not.toBeNull();
      expect(project?.clientName).toBe('Test Client');
      expect(project?.description).toBe('This is a test project description');
    });
  });

  describe('GET /api/projects/:projectId', () => {
    it('should return 404 for non-existent project', async () => {
      const res = await request(app).get(`/api/projects/${invalidId}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Proyecto no encontrado');
    });

    it('should return 500 for invalid MongoDB ID format', async () => {
      const res = await request(app).get(`/api/projects/${nonMongoId}`);
      expect(res.status).toBe(500);
    });

    it('should return project by ID', async () => {
      const project = await Project.create(validProject);
      const res = await request(app).get(`/api/projects/${project._id}`);
      expect(res.status).toBe(200);
      expect(res.body.projectName).toBe('Test Project');
    });

    it('should return project with populated tasks', async () => {
      const project = await Project.create(validProject);
      const res = await request(app).get(`/api/projects/${project._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('tasks');
      expect(Array.isArray(res.body.tasks)).toBe(true);
    });
  });

  describe('PUT /api/projects/:projectId', () => {
    it('should return 404 for non-existent project', async () => {
      const res = await request(app)
        .put(`/api/projects/${invalidId}`)
        .send({ projectName: 'Updated Project' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Proyecto no encontrado');
    });

    it('should return 500 for invalid MongoDB ID format', async () => {
      const res = await request(app)
        .put(`/api/projects/${nonMongoId}`)
        .send({ projectName: 'Updated Project' });
      expect(res.status).toBe(500);
    });

    it('should update project', async () => {
      const project = await Project.create(validProject);
      const res = await request(app)
        .put(`/api/projects/${project._id}`)
        .send({ projectName: 'Updated Project' });
      expect(res.status).toBe(200);
      expect(res.text).toBe('Proyecto actualizado correctamente');
      
      const updatedProject = await Project.findById(project._id);
      expect(updatedProject?.projectName).toBe('Updated Project');
    });

    it('should update multiple fields', async () => {
      const project = await Project.create(validProject);
      const res = await request(app)
        .put(`/api/projects/${project._id}`)
        .send({
          projectName: 'New Name',
          clientName: 'New Client',
          description: 'New description for testing',
        });
      expect(res.status).toBe(200);
      
      const updatedProject = await Project.findById(project._id);
      expect(updatedProject?.projectName).toBe('New Name');
      expect(updatedProject?.clientName).toBe('New Client');
      expect(updatedProject?.description).toBe('New description for testing');
    });
  });

  describe('DELETE /api/projects/:projectId', () => {
    it('should return 404 for non-existent project', async () => {
      const res = await request(app).delete(`/api/projects/${invalidId}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Proyecto no encontrado');
    });

    it('should return 500 for invalid MongoDB ID format', async () => {
      const res = await request(app).delete(`/api/projects/${nonMongoId}`);
      expect(res.status).toBe(500);
    });

    it('should delete project', async () => {
      const project = await Project.create(validProject);
      const res = await request(app).delete(`/api/projects/${project._id}`);
      expect(res.status).toBe(200);
      expect(res.text).toBe('Proyecto eliminado correctamente');
      
      const deletedProject = await Project.findById(project._id);
      expect(deletedProject).toBeNull();
    });

    it('should delete project and verify removal from database', async () => {
      const project = await Project.create(validProject);
      const projectId = project._id;
      
      await request(app).delete(`/api/projects/${projectId}`);
      
      const count = await Project.countDocuments({ _id: projectId });
      expect(count).toBe(0);
    });
  });

  describe('Validation Error Messages', () => {
    it('should return specific error for missing projectName', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ projectName: '', clientName: 'Client', description: 'Description' });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should return specific error for short projectName', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ projectName: 'ab', clientName: 'Client', description: 'Description' });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should return specific error for short description', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ projectName: 'Project', clientName: 'Client', description: 'Short' });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long projectName', async () => {
      const longName = 'a'.repeat(101);
      const res = await request(app)
        .post('/api/projects')
        .send({ projectName: longName, clientName: 'Client', description: 'This is a test project description' });
      expect(res.status).toBe(400);
    });

    it('should handle valid maximum length projectName', async () => {
      const maxName = 'a'.repeat(100);
      const res = await request(app)
        .post('/api/projects')
        .send({ projectName: maxName, clientName: 'Client', description: 'This is a test project description' });
      expect(res.status).toBe(200);
    });

    it('should handle request with extra unknown fields', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ ...validProject, extraField: 'ignored' });
      expect(res.status).toBe(200);
    });

    it('should handle update with empty body', async () => {
      const project = await Project.create(validProject);
      const res = await request(app)
        .put(`/api/projects/${project._id}`)
        .send({});
      expect(res.status).toBe(200);
    });
  });
});
