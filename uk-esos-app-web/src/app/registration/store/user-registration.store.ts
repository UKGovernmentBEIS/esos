import { inject, Injectable } from '@angular/core';

import { AuthStore } from '@core/store';
import { Store } from '@core/store/store';

import { initialState, UserRegistrationState } from './user-registration.state';

@Injectable({ providedIn: 'root' })
export class UserRegistrationStore extends Store<UserRegistrationState> {
  constructor() {
    const authStore = inject(AuthStore);
    super(initialState(authStore));
  }

  override reset(): void {
    const authStore = inject(AuthStore);
    this.setState(initialState(authStore));
  }
}
