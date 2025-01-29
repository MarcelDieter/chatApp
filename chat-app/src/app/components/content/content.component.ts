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
      new TimeAndDate(new Date())
    );
    this.messages.push(newMesage);
    this.inputMessage = '';
  }

  ngAfterViewChecked() {
    this.scrollToBottom('messagesContainer');
  }

}
