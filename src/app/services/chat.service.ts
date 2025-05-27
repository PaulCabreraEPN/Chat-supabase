// chat.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../supabase.clients'; // Asegúrate que la ruta sea correcta

export interface Message {
  id: number;
  content: string;
  sender: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private messages$ = new BehaviorSubject<Message[]>([]);

  constructor() {
    this.loadMessages();
    this.listenToNewMessages();
  }

  getMessages() {
    return this.messages$.asObservable();
  }

  async loadMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      this.messages$.next(data as Message[]);
    } else {
      console.error('Error loading messages:', error);
    }
  }

  async sendMessage(content: string, sender: string) {
    const { error } = await supabase
      .from('messages')
      .insert([{ content, sender }]);

    if (error) {
      console.error('Error sending message:', error);
    }
  }

  listenToNewMessages() {
    supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const current = this.messages$.value;
          this.messages$.next([...current, payload.new as Message]);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Listening to new messages...');
        }
      });
  }
}
