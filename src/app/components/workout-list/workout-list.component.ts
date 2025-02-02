import { Component, OnInit } from '@angular/core';
import { WorkoutService, Workout } from 'src/app/services/workout.service';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css']
})
export class WorkoutListComponent implements OnInit {
  workouts: Workout[] = [];
  searchText: string = '';
  filterType: string = '';
  workoutTypes: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  displayedColumns: string[] = ['name', 'workouts', 'workoutCount', 'totalMinutes'];

  constructor(private workoutService: WorkoutService) { }

  ngOnInit(): void {
    this.workoutService.workouts$.subscribe(workouts => {
      this.workouts = workouts;
    });
    this.workoutTypes = this.workoutService.getWorkoutTypes();
  }

  getFilteredWorkouts() {
    return this.workouts.filter(workout =>
      workout.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
      (this.filterType ? workout.workouts.some((w: any) => w.type.toLowerCase().includes(this.filterType.toLowerCase())) : true)
    );
  }

  get paginatedWorkouts() {
    const filteredWorkouts = this.getFilteredWorkouts();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filteredWorkouts.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.getFilteredWorkouts().length / this.itemsPerPage) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  hasNextPage(): boolean {
    return this.currentPage < this.getFilteredWorkouts().length / this.itemsPerPage;
  }

  hasPrevPage(): boolean {
    return this.currentPage > 1;
  }

  getWorkoutTypes(workouts: { type: string; minutes: number | null }[]) {
    if (workouts.length <= 3) {
      return workouts.map(workout => workout.type).join(', ');
    } else {
      const firstThree = workouts.slice(0, 3).map(workout => workout.type).join(', ');
      const moreCount = workouts.length - 3;
      return `${firstThree}, +${moreCount} more`;
    }
  }

  getTotalMinutes(workouts: { type: string, minutes: number | null }[]): number {
    return workouts.reduce((total, workout) => total + (workout.minutes || 0), 0);
  }

}