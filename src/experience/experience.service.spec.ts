import { buildPeriod } from './experience.service.js';

describe('buildPeriod', () => {
  it('counts both the first and the last month of a finished job', () => {
    const period = buildPeriod(
      new Date('2018-06-01'),
      new Date('2026-07-01'),
      new Date('2026-11-09'),
    );

    expect(period).toEqual({
      start: '2018-06',
      end: '2026-07',
      isCurrent: false,
      label: 'Jun 2018 - Jul 2026',
      durationMonths: 98,
    });
  });

  it('measures a current job up to now', () => {
    const period = buildPeriod(
      new Date('2026-07-01'),
      null,
      new Date('2026-11-09'),
    );

    expect(period.isCurrent).toBe(true);
    expect(period.label).toBe('Jul 2026 - Present');
    expect(period.durationMonths).toBe(5);
  });
});
