import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { WorkoutService } from 'src/app/services/workout.service';

Chart.register(...registerables);

interface Workout {
  type: string;
  minutes: number;
}

interface UserWorkout {
  id: number;
  name: string;
  workouts: Workout[];
}

@Component({
  selector: 'app-workout-chart',
  templateUrl: './workout-chart.component.html',
  styleUrls: ['./workout-chart.component.css']
})
export class WorkoutChartComponent implements OnInit {
  @ViewChild('workoutChart') chartRef!: ElementRef;
  workouts: UserWorkout[] = [];
  selectedUser: UserWorkout | null = null;
  chart: Chart | null = null;

  constructor(private workoutService: WorkoutService) { }

  ngOnInit(): void {
    this.workouts = this.workoutService.getWorkouts();
    if (this.workouts.length > 0) {
      this.selectUser(this.workouts[0]);
    }
  }

  ngAfterViewInit(): void {
    if (this.chartRef && this.selectedUser) {
      this.createChart();
    }
  }

  selectUser(user: UserWorkout): void {
    this.selectedUser = user;
    if (this.chart) {
      this.chart.destroy();
    }
    this.createChart();
  }

  createChart(): void {
    if (!this.selectedUser || !this.chartRef) return;

    const workoutsByType = this.selectedUser.workouts.reduce((acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + workout.minutes;
      return acc;
    }, {} as { [key: string]: number });

    const labels = Object.keys(workoutsByType);
    const data = Object.values(workoutsByType);

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Minutes',
          data: data,
          backgroundColor: 'rgba(135, 206, 235, 0.8)',
          borderColor: 'rgba(135, 206, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: false
            },
            grid: {
              display: true
            },
            ticks: {
              stepSize: 5
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }
}
