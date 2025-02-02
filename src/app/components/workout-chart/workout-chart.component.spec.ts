import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WorkoutChartComponent } from './workout-chart.component';
import { WorkoutService } from 'src/app/services/workout.service';

describe('WorkoutChartComponent', () => {
  let component: WorkoutChartComponent;
  let fixture: ComponentFixture<WorkoutChartComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;

  const mockWorkouts = [
    { id: 1, name: 'User 1', workouts: [{ type: 'Cardio', minutes: 30 }] },
    { id: 2, name: 'User 2', workouts: [{ type: 'Strength', minutes: 45 }] }
  ];

  beforeEach(waitForAsync(() => {
    workoutService = jasmine.createSpyObj('WorkoutService', ['getWorkouts']);

    workoutService.getWorkouts.and.returnValue(mockWorkouts);

    TestBed.configureTestingModule({
      declarations: [WorkoutChartComponent],
      providers: [{ provide: WorkoutService, useValue: workoutService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a list of users', () => {
    const userElements = fixture.debugElement.queryAll(By.css('.p-3.rounded.cursor-pointer'));
    expect(userElements.length).toBe(mockWorkouts.length);
    expect(userElements[0].nativeElement.textContent).toContain('User 1');
    expect(userElements[1].nativeElement.textContent).toContain('User 2');
  });

  it('should call selectUser when a user is clicked', () => {
    spyOn(component, 'selectUser');

    const userElements = fixture.debugElement.queryAll(By.css('.p-3.rounded.cursor-pointer'));
    userElements[0].nativeElement.click();
    fixture.detectChanges();

    expect(component.selectUser).toHaveBeenCalledWith(mockWorkouts[0]);
  });

  it('should highlight the selected user with bg-gray-200 class', () => {
    component.selectUser(mockWorkouts[0]);
    fixture.detectChanges();

    const selectedUser = fixture.debugElement.query(By.css('.bg-gray-200'));
    expect(selectedUser).toBeTruthy();
  });

  it('should create a chart when a user is selected', () => {
    spyOn(component, 'createChart');

    component.selectUser(mockWorkouts[0]);
    fixture.detectChanges();

    expect(component.createChart).toHaveBeenCalled();
  });

  it('should render the chart canvas element', () => {
    component.selectUser(mockWorkouts[0]);
    fixture.detectChanges();

    const canvasElement = fixture.debugElement.query(By.css('canvas'));
    expect(canvasElement).toBeTruthy();
  });
});