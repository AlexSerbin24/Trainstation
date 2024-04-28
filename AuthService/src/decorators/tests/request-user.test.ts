import { User } from "../request-user.decorator";
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('User decorator', () => {
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
  });

  it('should extract user from request', () => {
    const fakeRequest = { user: { id: 1, username: 'testUser' } };
    
    const fakeExecutionContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => fakeRequest,
      }),
    } as ExecutionContext;

    const user = User(null, fakeExecutionContext);
    expect(user).toEqual({ id: 1, username: 'testUser' });
  });
});