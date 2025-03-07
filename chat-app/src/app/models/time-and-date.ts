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

  turnDateToString() {
    return this.day + '. ' + this.month + ' ' + this.year;
  }

  getTime(date: Date) {
    let minutes = date.getMinutes().toString();
    let hours = date.getHours().toString();
    if (minutes.length == 1) {
      minutes = '0' + minutes;
    }
    this.time = hours + ':' + minutes;
  }

  isSameDayAs(secondDate: Date) {
    let secondTimeAndDate = new TimeAndDate(secondDate);
    return (
      this.day == secondTimeAndDate.day && 
      this.month == secondTimeAndDate.month && 
      this.year == secondTimeAndDate.year
    );
  }
}
