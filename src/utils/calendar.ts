import { CampusEvent } from '../types';

export function downloadEventIcs(event: CampusEvent) {
  const cleanDate = event.date.replace(/-/g, '');
  const startHours = event.startTime.replace(/:/g, '') + '00';
  const endHours = event.endTime.replace(/:/g, '') + '00';

  const dtStart = `${cleanDate}T${startHours}`;
  const dtEnd = `${cleanDate}T${endHours}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CampusOne//Campus Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:campusone-${event.id}@campusone.edu`,
    `DTSTAMP:${cleanDate}T120000Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, ' ')}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
