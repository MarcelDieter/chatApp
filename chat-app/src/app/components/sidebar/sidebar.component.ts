import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../user';
import { UserService } from '../../services/user.service';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-sidebar',
  imports: [MaterialModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  users: User[] = [];

  private userService = inject(UserService);

  ngOnInit(): void {
    this.users = this.userService.getUsers();
  }
}
