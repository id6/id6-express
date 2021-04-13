import request from 'supertest';
import express, { Express } from 'express';
import { Server } from 'http';
import { isAuthenticated } from './is-authenticated';

const fakeAuth = (req: any, res: any, next: any) => {
  if (req.header('Authorization')) {
    req.user = {
      id: 'userId',
    };
  }
  next();
};

describe('isAuthenticated', () => {

  let app: Express;
  let server: Server;

  beforeEach(async () => {
    app = express();
    app.use(fakeAuth);
    app.use('*', isAuthenticated, (req, res) => {
      res.status(200).send();
    });
    server = app.listen(3000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.close();
  });

  it('should be ok when user authenticated', async () => {
    const response = await request(app)
      .get('/')
      .set('Authorization', 'token')
      .send();

    expect(response.status).toEqual(200);
  });

  it('should throw error when user is not authenticated', async () => {
    const response = await request(app)
      .get('/id')
      .send();

    expect(response.status).toEqual(401);
  });

});
