const mod = require('./index');

describe('index', () => {

  afterEach(() => jest.restoreAllMocks());

  it('should export functions', async () => {
    expect(mod.authenticate).toBeDefined();
    expect(mod.isAuthenticated).toBeDefined();
    expect(mod.UnauthorizedError).toBeDefined();
    expect(mod.AuthorizationError).toBeDefined();
  });

});
