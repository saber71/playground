import { Injectable } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Injectable()
export class ApiService {
  constructor(
    readonly auth: AuthService,
    readonly user: UserService,
  ) {}
}
