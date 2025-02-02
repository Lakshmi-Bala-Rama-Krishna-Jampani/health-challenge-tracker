import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutService, Workout } from 'src/app/services/workout.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})
export class WorkoutFormComponent implements OnInit {
  userName: string = '';
  workoutTypes: string[] = [];
  workoutType: string = '';
  workoutMinutes: number | null = null;

  @Output() showChartChanged = new EventEmitter<boolean>();

  constructor(private workoutService: WorkoutService, private router: Router) { }

  ngOnInit(): void {
    this.workoutTypes = this.workoutService.getWorkoutTypes();
  }

  addWorkout(form: NgForm) {
    const userNameTrimmed = this.userName.trim();
    const workoutTypeTrimmed = this.workoutType.trim();

    if (!userNameTrimmed) {
      alert("Please enter a valid name.");
      return;
    }

    if (!workoutTypeTrimmed) {
      alert("Please enter a valid workout type.");
      return;
    }

    if (this.workoutMinutes === null || this.workoutMinutes <= 0) {
      alert("Please enter a valid number of minutes (greater than 0).");
      return;
    }

    const minutes = this.workoutMinutes ?? 0;

    let data: Workout[] = this.workoutService.getWorkouts();
    const userIndex = data.findIndex((workout: Workout) => 
      workout.name?.trim().toLowerCase() === userNameTrimmed.toLowerCase()
    );
    

    if (userIndex !== -1) {
      const newWorkout = { type: workoutTypeTrimmed, minutes: minutes };
      data[userIndex].workouts.push(newWorkout);
    } else {
      const newWorkout = {
        id: Date.now(),
        name: userNameTrimmed,
        workouts: [{ type: workoutTypeTrimmed, minutes: minutes }],
      };
      data.push(newWorkout);
    }
    this.workoutService.saveWorkouts(data);

    this.userName = '';
    this.workoutType = '';
    this.workoutMinutes = null;
    form.resetForm();
  }

  toggleChart() {
    this.showChartChanged.emit(true);
  }
}
