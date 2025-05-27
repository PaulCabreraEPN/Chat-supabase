import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Route, Router } from '@angular/router';
import { supabase } from 'src/app/supabase.clients';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgIf]
})
export class AuthPage {
  email = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  async login(){
    const {error} = await supabase.auth.signInWithPassword({
      email: this.email,
      password: this.password
    });
    if (error) this.error = error.message;
    else this.router.navigate(['/homePage'])
  }

  async register(){
    const {error} = await supabase.auth.signUp({
      email: this.email,
      password: this.password
    });

    if (error) this.error = error.message
    else alert('Resgistro exitoso, verifica tu correo electrónico')
  }

  ngOnInit() {
  }

}
