import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,map } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';

const BASIC_URL="http://localhost:8080/";
export const AUTH_HEADER='authorization';

interface AuthRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,private userStorageService:UserStorageService) { }

  registerClient(signupRequestDTO:any):Observable<any>{
    return this.http.post(BASIC_URL+"client/sign-up",signupRequestDTO);
  }
  registerCompany(signupRequestDTO:any):Observable<any>{
    return this.http.post(BASIC_URL+"company/sign-up",signupRequestDTO);
  }

  login(username: string, password: string) {
    const authRequest: AuthRequest = {
      username: username,
      password: password
    };

    return this.http.post(BASIC_URL + "authenticate", 
      authRequest,
      { 
        headers: {
          'Content-Type': 'application/json'
        },
        observe: 'response'
      }
    ).pipe(map((res: HttpResponse<any>) => {
      console.log('Response:', res);
      if (res.body) {
        this.userStorageService.saveUser(res.body);
        const bearerToken = res.headers.get(AUTH_HEADER);
        if (bearerToken) {
          const token = bearerToken.startsWith('Bearer ') ? bearerToken.substring(7) : bearerToken;
          this.userStorageService.saveToken(token);
        }
      }
      return res;
    }));
  }
}
