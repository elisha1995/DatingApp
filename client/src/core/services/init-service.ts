import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { User } from '../../types/user';
import { of } from 'rxjs';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private readonly accountService = inject(AccountService);
  private readonly likesService = inject(LikesService);

  init() {
    const userString = localStorage.getItem('user');
    if (!userString) return of(null);
    const user: User = JSON.parse(userString);
    this.accountService.currentUser.set(user);
    this.likesService.getLikeIds();
    return of(null);
  }
}
