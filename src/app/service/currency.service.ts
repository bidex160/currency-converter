import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Currency } from '../components/index.model';


@Injectable({
  providedIn: 'root',
})

export class CurrencyService {

  currenciesSubject: BehaviorSubject<any> = new BehaviorSubject([])
  rateSubject: BehaviorSubject<any> = new BehaviorSubject([])
  constructor(private http: HttpClient) {}

  /**
   * call endpoint to get currencies function
   * @returns 
   */
  getCurrencyList() {
   let url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json`
   this.http.get(url).subscribe({
    next:(r:any)=>{
      let currencies: Currency[] = []
     for(const [key, value] of Object.entries(r)){
      if(value)  currencies.push( {label: value as string, value: key})
     }
     this.currenciesSubject.next(currencies)
    },
    error: (er)=>{
      this.currenciesSubject.next([])
    }
   });
  }

  /**
   * get currency rate by base currency and date (optional)
   * @param base base currency
   * @param date optional - date
   */
  getRate(base: string, date?: string){
    let url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date ? date : 'latest'}/v1/currencies/${base}.json`
    this.http.get(url).subscribe({
      next:(r:any)=>{
        let currencies: Currency[] = []
       for(const [key, value] of Object.entries(r[base])){
          currencies.push( {label: key, value: value as any})
       }
       this.rateSubject.next(currencies)
      },
      error: (er)=>{
        this.rateSubject.next([])
      }
     });
  }

}