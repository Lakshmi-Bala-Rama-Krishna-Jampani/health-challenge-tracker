import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutFormComponent } from './workout-form.component';
import { WorkoutService } from 'src/app/services/workout.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;
  let workoutService: WorkoutService;
  let mockWorkoutService: jasmine.SpyObj<WorkoutService>;

  beforeEach(async () => {
    mockWorkoutService = jasmine.createSpyObj('WorkoutService', ['getWorkoutTypes', 'getWorkouts', 'saveWorkouts']);
    mockWorkoutService.getWorkoutTypes.and.returnValue(['Running', 'Cycling', 'Swimming', 'Yoga']);
    mockWorkoutService.getWorkouts.and.returnValue([]);
    mockWorkoutService.saveWorkouts.and.callFake(() => { });

    await TestBed.configureTestingModule({
      declarations: [WorkoutFormComponent],
      imports: [FormsModule, MatButtonModule, MatInputModule, MatSelectModule, BrowserAnimationsModule],
      providers: [{ provide: WorkoutService, useValue: mockWorkoutService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    workoutService = TestBed.inject(WorkoutService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load workout types on initialization', () => {
    expect(component.workoutTypes.length).toBeGreaterThan(0);
    expect(component.workoutTypes).toEqual(['Running', 'Cycling', 'Swimming', 'Yoga']);
  });

  it('should call addWorkout and add a new workout when form is valid', () => {
    component.userName = 'John Doe';
    component.workoutType = 'Running';
    component.workoutMinutes = 30;

    mockWorkoutService.getWorkouts.and.returnValue([]);

    component.addWorkout({ resetForm: jasmine.createSpy() } as any);

    expect(mockWorkoutService.saveWorkouts).toHaveBeenCalled();
    expect(mockWorkoutService.saveWorkouts).toHaveBeenCalledWith([{
      id: jasmine.any(Number),
      name: 'John Doe',
      workouts: [{ type: 'Running', minutes: 30 }]
    }]);
  });

  it('should show an alert if name is empty in addWorkout', () => {
    spyOn(window, 'alert');

    component.userName = '';
    component.workoutType = 'Running';
    component.workoutMinutes = 30;

    component.addWorkout({} as any);

    expect(window.alert).toHaveBeenCalledWith('Please enter a valid name.');
  });

  it('should show an alert if workout type is empty in addWorkout', () => {
    spyOn(window, 'alert');

    component.userName = 'John Doe';
    component.workoutType = '';
    component.workoutMinutes = 30;

    component.addWorkout({} as any);

    expect(window.alert).toHaveBeenCalledWith('Please enter a valid workout type.');
  });

  it('should show an alert if workout minutes is less than or equal to 0 in addWorkout', () => {
    spyOn(window, 'alert');

    component.userName = 'John Doe';
    component.workoutType = 'Running';
    component.workoutMinutes = -10;

    component.addWorkout({} as any);

    expect(window.alert).toHaveBeenCalledWith('Please enter a valid number of minutes (greater than 0).');
  });

  it('should emit showChartChanged event when toggleChart is called', () => {
    spyOn(component.showChartChanged, 'emit');

    component.toggleChart();

    expect(component.showChartChanged.emit).toHaveBeenCalledWith(true);
  });

  it('should reset the form after adding a workout', () => {
    component.userName = 'John Doe';
    component.workoutType = 'Running';
    component.workoutMinutes = 30;

    mockWorkoutService.getWorkouts.and.returnValue([]);

    const form = { resetForm: jasmine.createSpy() };

    component.addWorkout(form as any);

    expect(form.resetForm).toHaveBeenCalled();
    expect(component.userName).toBe('');
    expect(component.workoutType).toBe('');
    expect(component.workoutMinutes).toBeNull();
  });

  it('should update workout for existing user', () => {
    const existingUser = { name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] };

    mockWorkoutService.getWorkouts.and.returnValue([existingUser]);

    component.userName = 'John Doe';
    component.workoutType = 'Cycling';
    component.workoutMinutes = 45;

    component.addWorkout({ resetForm: jasmine.createSpy() } as any);

    expect(existingUser.workouts.length).toBe(2);
    expect(existingUser.workouts[1].type).toBe('Cycling');
    expect(existingUser.workouts[1].minutes).toBe(45);
  });

  it('should handle user name case insensitivity when adding a workout', () => {
    component.userName = 'john doe';
    component.workoutType = 'Running';
    component.workoutMinutes = 30;
  
    const existingUser = { name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] };
    mockWorkoutService.getWorkouts.and.returnValue([existingUser]);
  
    component.addWorkout({ resetForm: jasmine.createSpy() } as any);
  
    expect(existingUser.workouts.length).toBe(2);
    expect(existingUser.workouts[1].type).toBe('Running');
    expect(existingUser.workouts[1].minutes).toBe(30);
  });
  
  it('should show alert for zero minutes in addWorkout', () => {
    spyOn(window, 'alert');
  
    component.userName = 'John Doe';
    component.workoutType = 'Running';
    component.workoutMinutes = 0;
  
    component.addWorkout({} as any);
  
    expect(window.alert).toHaveBeenCalledWith('Please enter a valid number of minutes (greater than 0).');
  });
  
  it('should add multiple workouts for the same user', () => {
    const existingUser = { name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] };
  
    mockWorkoutService.getWorkouts.and.returnValue([existingUser]);
  
    component.userName = 'John Doe';
    component.workoutType = 'Cycling';
    component.workoutMinutes = 45;
  
    component.addWorkout({ resetForm: jasmine.createSpy() } as any);
  
    expect(existingUser.workouts.length).toBe(2);
    expect(existingUser.workouts[1].type).toBe('Cycling');
    expect(existingUser.workouts[1].minutes).toBe(45);
  });
  
});
