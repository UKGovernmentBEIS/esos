import { PhasesPipe } from './phases.pipe';

describe('PhasesPipe', () => {
  const pipe = new PhasesPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform phases', () => {
    expect(pipe.transform('PHASE_3')).toEqual('Phase 3');
  });
});
