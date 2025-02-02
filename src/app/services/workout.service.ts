import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Workout {
  id: number;
  name: string;
  workouts: { type: string; minutes: number | null }[];
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private workoutTypes = ['Running', 'Cycling', 'Swimming', 'Yoga'];
  private STORAGE_KEY = 'workoutData';
  private workoutsSubject = new BehaviorSubject<Workout[]>(this.getWorkouts()); // Initial data
  workouts$ = this.workoutsSubject.asObservable();

  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialData = [
        {
          id: 1,
          name: 'John Doe',
          workouts: [
            { type: 'Running', minutes: 30 },
            { type: 'Cycling', minutes: 45 }
          ]
        },
        {
          id: 2,
          name: 'Jane Smith',
          workouts: [
            { type: 'Swimming', minutes: 60 },
            { type: 'Running', minutes: 20 }
          ]
        },
        {
          id: 3,
          name: 'Mike Johnson',
          workouts: [
            { type: 'Yoga', minutes: 50 },
            { type: 'Cycling', minutes: 40 }
          ]
        }
      ];
      this.saveWorkouts(initialData);
    }
  }

  getWorkouts() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  saveWorkouts(data: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    this.workoutsSubject.next(data);
  }

  getWorkoutTypes() {
    return this.workoutTypes;
  }
}
