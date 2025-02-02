import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutListComponent } from './workout-list.component';
import { WorkoutService } from 'src/app/services/workout.service'; 

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkoutListComponent],
      providers: [WorkoutService] 
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter workouts based on search text', () => {
    component.searchText = 'John';
    component.workouts = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Yoga', minutes: 30 }] },
      { id: 2, name: 'Jane Smith', workouts: [{ type: 'Cardio', minutes: 20 }] }
    ];
    fixture.detectChanges();

    const filteredWorkouts = component.getFilteredWorkouts();
    expect(filteredWorkouts.length).toBe(1);
    expect(filteredWorkouts[0].name).toBe('John Doe');
  });

  it('should filter workouts based on workout type', () => {
    component.filterType = 'Yoga';
    component.workouts = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Yoga', minutes: 30 }] },
      { id: 2, name: 'Jane Smith', workouts: [{ type: 'Cardio', minutes: 20 }] }
    ];
    fixture.detectChanges();

    const filteredWorkouts = component.getFilteredWorkouts();
    expect(filteredWorkouts.length).toBe(1);
    expect(filteredWorkouts[0].name).toBe('John Doe');
  });

  it('should paginate workouts', () => {
    component.workouts = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Cardio', minutes: 30 }] },
      { id: 2, name: 'Jane Smith', workouts: [{ type: 'Strength', minutes: 20 }] },
      { id: 3, name: 'Alice Johnson', workouts: [{ type: 'Yoga', minutes: 40 }] },
      { id: 4, name: 'Bob Brown', workouts: [{ type: 'Running', minutes: 25 }] },
      { id: 5, name: 'Charlie Davis', workouts: [{ type: 'Cardio', minutes: 15 }] },
      { id: 6, name: 'David Wilson', workouts: [{ type: 'Strength', minutes: 35 }] }
    ];
    component.itemsPerPage = 5;
    component.currentPage = 1;
    fixture.detectChanges();

    const paginatedWorkouts = component.paginatedWorkouts;
    expect(paginatedWorkouts.length).toBe(5);
    expect(paginatedWorkouts[0].name).toBe('John Doe');
  });

  it('should return all workouts when search text is empty', () => {
    component.searchText = '';
    component.workouts = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Yoga', minutes: 30 }] },
      { id: 2, name: 'Jane Smith', workouts: [{ type: 'Cardio', minutes: 20 }] }
    ];
    fixture.detectChanges();
  
    const filteredWorkouts = component.getFilteredWorkouts();
    expect(filteredWorkouts.length).toBe(2); 
  });
  
});