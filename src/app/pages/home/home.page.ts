import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { supabase } from 'src/app/supabase.clients';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  email = '';
  message = '';
  messages = signal<any[]>([]); // tipo rápido, puedes tipar con interfaz

  constructor(private route: Router) {}

  async ngOnInit() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      this.route.navigate(['/auth']);
    } else {
      this.email = data.user.email || '';
      await this.loadMessages();
      this.listenToMessages();
    }
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    this.route.navigate(['/auth']);
  }
}

  async logout() {
    await supabase.auth.signOut();
    this.route.navigate(['/auth']);
  }

  async loadMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      this.messages.set(data);
    }
  }

  async sendMessage() {
    if (!this.message.trim()) return;

    const { error } = await supabase.from('messages').insert([
      {
        content: this.message,
        sender: this.email
      }
    ]);

    if (!error) {
      this.message = '';
    } else {
      console.error('Error al enviar mensaje:', error);
    }
  }

  listenToMessages() {
    supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const current = this.messages();
          this.messages.set([...current, payload.new]);
        }
      )
      .subscribe();
  }
}


