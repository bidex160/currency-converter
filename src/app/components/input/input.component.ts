import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputType } from '../index.model';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  @Input() type: InputType;
  @Input() name: string;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() form: FormGroup;
  @Input() min: number;
  @Input() valueField: string;
  @Input() labelField: string;
  __option: any[] = [];
  @Input('options') set _option(v: any[]) {
    this.__option = this.formatOption(v);
  }

  @Output() mchange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {
  
  }

  /**
   * funtion to format raw options
   * @param options raw option
   * @returns formatted options
   */
  formatOption = (options: any[]) => {
    let format = options.map((r, i) => {
      let value;
      let label;
      if (this.valueField) value = r[this.valueField];
      if (this.labelField) label = r[this.labelField];

      if (this.valueField && this.labelField)
        return {
          value: value,
          label: label,
        };
      else
        return {
          value: options[i],
          label: options[i],
        };
    });
    return format;
  };

  /**
   * function to listen to input chnage / option selected
   * @param event input / option selected event 
   * @returns 
   */
  inputChange(event: any) {
    if (this.type == 'autocomplete') {
      if (event.option.value) this.mchange.emit(event.option.value);
      return;
    }
   this.mchange.emit(event.target.value);
  }

}
