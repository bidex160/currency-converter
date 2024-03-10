import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { ComponentsModule } from '../components/shared.module';
import {MatIconModule} from '@angular/material/icon';
import { CurrencyService } from '../service/currency.service';
import { Currency } from '../components/index.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ComponentsModule,MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  form: FormGroup = new FormGroup({
    baseCurrency: new FormControl('ngn', Validators.required),
    toCurrency: new FormControl(null, Validators.required),
    baseAmount: new FormControl(1, Validators.min(0)),
    toAmount: new FormControl(1, Validators.min(0)),
    date: new FormControl(null)
  })
  currencies: Currency[] = [];
  rates: Currency[] = [];

  constructor(private curServ: CurrencyService){}
  ngOnInit() {
    this.curServ.getCurrencyList()
    this.curServ.getRate(this.form.value.baseCurrency)
    this.curServ.currenciesSubject.subscribe((r)=>this.currencies = r)
    this.curServ.rateSubject.subscribe((r)=>{
      this.rates = r
      if(this.form.value.baseCurrency && this.form.value.toCurrency){
        let currencyRate =  this.rates.find((curr)=>curr.label?.toLowerCase() == this.form.value.toCurrency?.toLowerCase())?.value as number || 1

        if(this.form.value.baseAmount)
        this.form.patchValue({toAmount: this.form.value.baseAmount * currencyRate})
       
      }
    })
  }


  currencyChanged(event: any, isBase: boolean = false){
    if(isBase){
      this.rates = []
      this.curServ.getRate(event)
    }
    else{
     let result =  this.rates.find((curr)=>curr.label.toLowerCase() == event)
     let baseAmount = this.form.value.baseAmount;
     this.form.patchValue({toAmount: result?.value  as number * baseAmount})
    }
  }

  amountChanged(event: any, isBase: boolean = false){
    if(isBase){
      let currencyRate =  this.rates.find((curr)=>curr.label?.toLowerCase() == this.form.value.toCurrency?.toLowerCase())?.value as number || 1 
      let baseAmount = event;
      this.form.patchValue({toAmount: baseAmount * currencyRate})
    }else{
      let currencyRate =  this.rates.find((curr)=>curr.label?.toLowerCase() == this.form.value.toCurrency?.toLowerCase())?.value as number || 1 
      let rateAmount = event;
      this.form.patchValue({baseAmount: rateAmount / currencyRate  })
    }

  }


  dateChanged(date: any){
   if(this.form.value.baseCurrency) this.curServ.getRate(this.form.value.baseCurrency,date)
  }


}
