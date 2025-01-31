import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { FormsModule } from '@angular/forms';
import { TimeAndDate } from '../../time-and-date';
import { Message } from '../../message';

@Component({
  selector: 'app-content',
  imports: [MaterialModule, FormsModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {
  inputMessage = '';
  messages: Message[] = [
    new Message(
      {
        name: 'test user',
        profilePic: '/profilePics/shiba1.jpg',
        active: false,
      },
      'test message',
      new TimeAndDate(new Date())
    ),
  ];

  timeChanged = false;

  scrollToBottom(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
    }
  }

  addMessage() {
    if (this.inputMessage.length == 0) {
      return;
    }
    let newMesage: Message = new Message(
      {
        name: 'test user',
        profilePic: '/profilePics/shiba1.jpg',
        active: false,
      },
      this.inputMessage,
      this.getNewTime()
    );
    this.messages.push(newMesage);
    this.inputMessage = '';
  }

  ngAfterViewChecked() {
    this.scrollToBottom('messagesContainer');
  }

  changeDate() {
    this.timeChanged = true;
  }

  getNewTime() {
    let newTimeAndDate = new TimeAndDate(new Date());      //check to see whether the time separation feature works
    if (this.timeChanged) {
      newTimeAndDate.day += 1;
      this.timeChanged = false;
    }
    return newTimeAndDate;
  }

}
