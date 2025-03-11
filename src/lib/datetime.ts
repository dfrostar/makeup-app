export const projectTimeZone = 'America/Chicago';

export function toProjectTime(date: Date): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: projectTimeZone }));
}

export function validateTimezone(date: Date): void {
  if (!Intl.DateTimeFormat().resolvedOptions().timeZone) {
    throw new Error('Timezone support required');
  }
}
