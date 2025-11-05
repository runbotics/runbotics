import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {
        
    }
    
    @Post()
    async generateToken() {
        return this.authService.login({username: 'testUser', id:'testUser'})
    }
}
