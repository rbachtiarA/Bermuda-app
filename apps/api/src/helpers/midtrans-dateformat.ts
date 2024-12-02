export function formatDateMidtrans(date: Date): string {
    const year: string = date.getFullYear().toString();
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const day: string = String(date.getDate()).padStart(2, '0');
    const hours: string = String(date.getHours()).padStart(2, '0');
    const minutes: string = String(date.getMinutes()).padStart(2, '0');
    const seconds: string = String(date.getSeconds()).padStart(2, '0');
    
    // Get timezone offset in hours and minutes
    const timezoneOffset: number = date.getTimezoneOffset();
    const absOffsetHours: string = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
    const absOffsetMinutes: string = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
    const timezone: string = `${timezoneOffset <= 0 ? '+' : '-'}${absOffsetHours}${absOffsetMinutes}`;
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${timezone}`;
  }