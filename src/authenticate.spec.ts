import request from 'supertest';
import express, { ErrorRequestHandler, Express } from 'express';
import { Server } from 'http';
import { authenticate } from './authenticate';
import nock from 'nock';
import cookieParser from 'cookie-parser';

describe('authenticate', () => {

  let app: Express;
  let server: Server;
  let error: any;

  beforeEach(async () => {
    process.env.ID6_AUTHORIZATION_URL = 'http://auth.server.com';
    process.env.ID6_AUTHORIZATION_SECRET = 'secret';

    error = undefined;

    app = express();
    app.use(cookieParser());
    app.use(authenticate);
    app.use('*', (req, res) => {
      res.json(req.user || null);
    });
    app.use(<ErrorRequestHandler>((err, req, res, next) => {
      error = err;
      res.status(500).send();
    }));

    server = app.listen(3000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.close();
  });

  it('should set user', async () => {
    let authRequestBody = undefined;

    nock('http://auth.server.com')
      .post('/authorize', body => {
        authRequestBody = body;
        return body;
      })
      .matchHeader('Authorization', 'secret')
      .reply(200, {
        user: {
          id: 1,
        },
      });

    const response = await request(app)
      .get('/')
      .set('Cookie', 'auth=token')
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      id: 1,
    });
    expect(authRequestBody).toEqual({
      token: 'token',
    });
  });

  it('should do nothing when no auth cookie', async () => {
    const response = await request(app)
      .get('/')
      .send();

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(null);
  });

  it('should throw error when id6 throws', async () => {
    nock('http://auth.server.com')
      .post('/authorize')
      .matchHeader('Authorization', 'secret')
      .reply(200, {
        error: {
          message: 'message',
          code: 'code',
        },
      });

    const response = await request(app)
      .get('/')
      .set('Cookie', 'auth=token')
      .send();

    expect(response.status).toEqual(500);
    expect(error.code).toEqual('validation_error');
  });

  it('should catch axios errors and rethrow', async () => {
    nock('http://auth.server.com')
      .post('/authorize')
      .reply(404);

    const response = await request(app)
      .get('/')
      .set('Cookie', 'auth=token')
      .send();

    expect(response.status).toEqual(500);
    expect(error.code).toEqual('axios_error');
  });

});
