import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'health-tracker';
  showChart = false;

  ngOnInit() {
    this.showChart = false;
  }
  prevPage() {
    this.showChart = false;
  }

  toggleChart(event: boolean) {
    this.showChart = event;
  }
}
