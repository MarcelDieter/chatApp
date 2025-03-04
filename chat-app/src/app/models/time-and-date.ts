export class TimeAndDate {
  time: string = '';
  day: string = '';
  month: string = '';
  year: string = '';

  constructor(newDate: Date) {
    this.day = newDate.getDate().toString();
    this.getMonth(newDate);
    this.year = newDate.getFullYear().toString();
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


}
