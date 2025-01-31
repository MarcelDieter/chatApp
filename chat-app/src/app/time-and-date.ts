export class TimeAndDate {
  time: string = '';
  day: string = '';
  month: string = '';
  year: string = '';

  constructor(newDate: Date) {
    this.getTime(newDate);
    this.day = newDate.getDate().toString();
    this.getMonth(newDate);
    this.year = newDate.getFullYear().toString();
  }

  getTime(date: Date) {
    let minutes = date.getMinutes().toString();
    let hours = date.getHours().toString();

    if (minutes.length == 1) {
      minutes = '0' + minutes;
    }
    this.time = hours + ':' + minutes;
  }

  getMonth(date: Date) {
    const MONTH = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.month = MONTH[date.getMonth()];
  }

  getWholeDate() {
    return this.day + '. ' + this.month + ' ' + this.year;
  }

  dateIsEqualTo(otherDate: TimeAndDate | null) { 
    if (!otherDate) {
      return null;
    }
    return this.day == otherDate.day && this.month == otherDate.month && this.year == otherDate.year;
  } 
}
