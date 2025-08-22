import { MinutesToHoursPipe } from './minutes-to-hours.pipe';

describe('MinutesToHoursPipe', () => {
  const pipe = new MinutesToHoursPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 1 hour', () => {
    expect(pipe.transform(60)).toEqual('1 hour');
  });

  it('should return minutes', () => {
    expect(pipe.transform(30)).toEqual('30 minutes');
  });

  it('should return hours', () => {
    expect(pipe.transform(128)).toEqual('2 hours');
  });

  it('should do something', () => {
    expect(pipe.transform(undefined)).toEqual('');
  });
});
