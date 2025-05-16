import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements AfterViewChecked {
  messages: { sender: string; text: string }[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  isMinimized: boolean = false;

  @ViewChild('scrollMe') private messagesContainer!: ElementRef;

  private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta1/models/gemini-pro:generateContent?key=AIzaSyBQBa2CfWp89H_WXC5Y5SJTBkhQPAL8pbg';

  constructor(private http: HttpClient) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
  }

  sendMessage(): void {
    const input = this.userInput.trim();
    if (!input) return;

    this.messages.push({ sender: 'user', text: input });
    this.userInput = '';
    this.isLoading = true;

    // API chính xác theo mẫu của Gemini 2.0 Flash
    const API_KEY = 'AIzaSyDejoENNlcCcS6b_OctHO0JZ_yTz8a6HIQ';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const body = {
      contents: [
        {
          parts: [{ text: input }]
        }
      ]
    };

    this.http.post(url, body, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (res: any) => {
        const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || '🤖 Không có phản hồi từ Gemini.';
        this.messages.push({ sender: 'bot', text });
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: err => {
        console.error('Lỗi gọi Gemini:', err);
        this.messages.push({ sender: 'bot', text: '❌ Lỗi khi gọi Gemini. Có thể do CORS hoặc API_KEY sai.' });
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }
}

