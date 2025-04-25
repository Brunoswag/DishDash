// Spencer Lommel 4/25/25

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // TODO: Setup firebase connection to pull in user data
  private user = {
    username: 'JohnDoe',
    profilePicture: 'https://t4.ftcdn.net/jpg/00/72/27/13/240_F_72271347_Upeb6J6n9PkS8kqEUpZltIkLlboW5B1P.jpg',
  };

  getUser() {
    return this.user;
  }
}