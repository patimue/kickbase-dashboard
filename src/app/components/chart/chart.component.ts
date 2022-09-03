import { getCurrencySymbol } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit {

  @Input() values?: number[];

  @ViewChild('wrapper') wrapper: any | undefined;

  maxValue: number = 0;

  constructor() {
  }

  ngOnInit(): void {
    if (this.values !== undefined) {
      this.values = this.values.reverse();
      for (let num of this.values) {
        if (num > this.maxValue)
          this.maxValue = num;
      }
      console.log(this.maxValue)
    }
  }

  ngAfterViewInit(): void {
    console.log(this.wrapper.nativeElement instanceof HTMLDivElement)
    if (this.wrapper.nativeElement instanceof HTMLDivElement) {
      console.log(this.wrapper.nativeElement.children)
      if (this.wrapper.nativeElement.children.length > 0) {
        console.log('Moving!')
        this.wrapper.nativeElement.children[this.wrapper.nativeElement.children.length - 1].scrollIntoView();
      }
    }
  }

  compareForColor(index: number): string {
    if (this.values !== undefined) {
      if (index === 0) {
        return "darkgreen"
      } else {
        if (this.values[index - 1] > this.values[index]) {
          return "red";
        } else {
          return "darkgreen";
        }
      }
      return "red";

    } else {
      return "red";
    }
  }


  marketValueString(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}
