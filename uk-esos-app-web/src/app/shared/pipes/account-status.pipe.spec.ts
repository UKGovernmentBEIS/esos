import { AccountStatusPipe } from './account-status.pipe';

describe('AccountStatusPipe', () => {
  const pipe = new AccountStatusPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform account statuses', () => {
    let transformation = pipe.transform(null);
    expect(transformation).toEqual(null);

    transformation = pipe.transform(undefined);
    expect(transformation).toEqual(null);

    transformation = pipe.transform('DENIED');
    expect(transformation).toEqual('Denied');

    transformation = pipe.transform('LIVE');
    expect(transformation).toEqual('Live');

    transformation = pipe.transform('AWAITING_APPROVAL');
    expect(transformation).toEqual('Awaiting approval');

    transformation = pipe.transform('CLOSED');
    expect(transformation).toEqual('Closed');
  });
});
