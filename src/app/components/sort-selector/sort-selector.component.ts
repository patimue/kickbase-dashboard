import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sort-selector',
  templateUrl: './sort-selector.component.html',
  styleUrls: ['./sort-selector.component.scss']
})
export class SortSelectorComponent implements AfterViewInit {

  @ViewChild('indicator') indicator: any | null;

  @Input() options!: string[];

  @Output() selection = new EventEmitter<string>();

  public choice: string | undefined;

  constructor() {
    this.getLocal(false);
  }

  ngAfterViewInit(): void {
    this.getLocal(true)
  }

  onClick(selection: string) {
    selection = selection ?? this.choice;
    let element = document.querySelector(`#${selection}`);
    if (element instanceof HTMLElement) {
      console.log(selection);
      this.writeLocal(selection);
      if (this.indicator.nativeElement instanceof HTMLElement) {
        console.log('SELECTION EMIT')
        console.log(selection);
        this.selection.emit(selection);
        this.indicator.nativeElement.style.left = element.offsetLeft + "px";
      }
    }
  }

  writeLocal(selection: string) {
    localStorage.setItem('selection', selection);
  }

  getLocal(simClick: boolean) {
    let item = localStorage.getItem('selection');
    console.log(item);
    if (item !== null) {
      this.choice = item;
      if (simClick)
        this.onClick(item);
    }
  }

}
