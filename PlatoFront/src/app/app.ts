import {Component, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api';
import { Usuario } from './models/configuracoes.models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  protected readonly title = signal('plato');

  usuarios: readonly Usuario[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      }, error : (err) => {
        console.log('Erro ao buscar dados: ',err);
      }
    })
  }
}
