import { AccountStatusTagColorPipe } from './account-status-tag-color.pipe';

describe('AccountStatusTagColorPipe', () => {
  const pipe = new AccountStatusTagColorPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform account statuses', () => {
    let transformation = pipe.transform(null);
    expect(transformation).toEqual(null);

    transformation = pipe.transform(undefined);
    expect(transformation).toEqual(null);

    transformation = pipe.transform('DENIED');
    expect(transformation).toEqual('red');

    transformation = pipe.transform('LIVE');
    expect(transformation).toEqual('green');

    transformation = pipe.transform('AWAITING_APPROVAL');
    expect(transformation).toEqual('red');

    transformation = pipe.transform('CLOSED');
    expect(transformation).toEqual('grey');
  });
});
