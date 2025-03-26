export class TimeAndDate {
  date: Date;
  time: string;
  day: number;
  month: string;
  year: number;

  constructor(newDate: Date) {
    this.date = newDate;
    this.time = this.getTime(newDate);
    this.day = newDate.getDate();
    this.month = this.getMonth(newDate);
    this.year = newDate.getFullYear();
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
    return MONTH[date.getMonth()];
  }

  getTime(date: Date) {
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let hours = date.getHours().toString();
    return `${hours}:${minutes}`;
  }


  getTimeStamp() {
    const currentDate = new TimeAndDate(new Date());
    let timeStamp = '';

    if (this.year == currentDate.year && this.month == currentDate.month) {
      if (this.day == currentDate.day) {
        timeStamp = 'Today';
      } 
      else if (this.day + 1 == currentDate.day) {
        timeStamp = 'Yesterday';
      }
      else if (currentDate.day - this.day <= 6) {
        timeStamp = this.getDayOfWeek();
      } 
    }
    else {
      timeStamp = `${this.day}. ${this.month}`;
      if (this.year != currentDate.year) {
        timeStamp += ` ${this.year}`;
      }
    }
    return timeStamp;
  }

  isSameDay(newDate: Date) {
    let secondDate = new TimeAndDate(newDate);
    return this.year == secondDate.year && this.month == secondDate.month && this.day == secondDate.day;
  }

  getDayOfWeek(): string {
    const DAYS = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    return DAYS[this.date.getDay()];
  }
}
