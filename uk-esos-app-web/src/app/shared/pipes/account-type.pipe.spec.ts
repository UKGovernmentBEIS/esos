import { AccountTypePipe } from './account-type.pipe';

describe('AccountTypePipe', () => {
  let pipe: AccountTypePipe;

  beforeEach(() => (pipe = new AccountTypePipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform account types', () => {
    expect(pipe.transform('ORGANISATION')).toEqual('Organisation');
    expect(pipe.transform(undefined)).toEqual(null);
  });
});
