import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton,
  IonLabel, IonSearchbar, IonButton, IonSpinner, IonText, IonCard,
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonChip,
  IonIcon, IonProgressBar, IonInput, IonGrid, IonRow, IonCol,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { search, volumeHigh } from 'ionicons/icons';
import { Poke, PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton,
    IonLabel, IonSearchbar, IonButton, IonSpinner, IonText, IonCard,
    IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonChip,
    IonIcon, IonProgressBar, IonInput, IonGrid, IonRow, IonCol,
  ],
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page {

  tab: 'buscar'|'comparar'= 'buscar';
  query = '';
  pokemon: Poke |null = null;
  loading = false;
  error = '';
  showGif = false;
  selectedImg = '';
  qA = '';
  qB = '';
  a: Poke | null = null;
  b: Poke | null = null;
   errCmp = '';

  constructor(private svc: PokemonService) {addIcons({volumeHigh})}
  async buscar (){
    if(!this.query.trim()) return;
    this.loading= true;
    this.error = '';
    this.showGif = false;

    try{
      this.pokemon = await this.svc.search(this.query);
      this.selectedImg = this.pokemon.gallery[0]?.url ?? '';
    }catch{
      this.pokemon = null;
      this.error = 'No se encontró ese pokemón';
    }
    this.loading = false;
  }
  playCry(){
    if (this.pokemon?.cry) new Audio(this.pokemon.cry).play();
  }
  async comparar (){
    this.errCmp = '';
    try{
      [this.a, this.b]= await Promise.all([
        this.svc.search(this.qA),
        this.svc.search(this.qB)
      ]);
    }catch{
      this.a = this.b = null;
      this.errCmp = 'Revisa los nombres de ambos Pokemón'
    }
  }

  statOf (p:Poke, name: string){
    return p.stats.find((s)=>s.name === name)?.value ?? 0;
  }

  win (name: string, mine:Poke, other:Poke){
    return this.statOf(mine, name) >this.statOf(other,name);
  }
}