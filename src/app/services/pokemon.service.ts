import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'

export interface Poke {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: string[];
    abilities: string[];
    stats: {name:string; value:number}[];
    cry: string | null;
    gallery: {label:string; url:string}[];
    animated: string |null;
}

@Injectable({ providedIn: 'root'})
export class PokemonService{
    private api = 'https://pokeapi.co/api/v2/pokemon/';
    constructor(private http: HttpClient){}
    async search(query:string): Promise<Poke> {
        const data:any = await firstValueFrom(
            this.http.get(this.api + query.trim().toLowerCase())
        );
        const sprite = data.sprites;
        const candidates = [
            {label: 'Arte Oficial', url: sprite.other?.['official-artwork']?.front_default},
            {label: 'Home', url: sprite.other?.home?.front_default},
            {label: 'Frente', url: sprite.front_default},
            {label: 'Espalda', url: sprite.back_default},
            {label: 'Shiny', url: sprite.front_shiny},
            {label: 'Shiny', url: sprite.back_shiny},
            {label: 'Home Shany', url: sprite.other?.home?.front_shinyefault},
        ]
        return {
            id: data.id,
            name : data.name,
            height: data.height / 10,
            weight: data.weight / 10,
            types :data.types.map((t:any)=>t.type.name),
            abilities: data.abilities.map((a:any)=> a.ability.name),
            stats: data.stats.map((s:any)=>({name: s.stat.name, value: s.stat.base_stat})),
            cry: data.cries?.latest ?? data.cries?.legacy ?? null,
            gallery: candidates.filter((c)=> !!c.url),
            animated: 
                sprite.other?.showdown?.front_default ??
                sprite.version?.['generation-v']?.['black-white']?.animated?.front_default ??
                null,
        };
    }

}