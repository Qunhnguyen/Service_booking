import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly apiKey = 'AIzaSyBTlQghzvv7iMhH3VswYFLW1GIpAwa-sLE'; // 🔒 Đổi thành API key thật
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const body = {
      contents: [
        {
          parts: [{ text: message }]
        }
      ]
    };

    return this.http.post(`${this.apiUrl}?key=${this.apiKey}`, body);
  }
}
