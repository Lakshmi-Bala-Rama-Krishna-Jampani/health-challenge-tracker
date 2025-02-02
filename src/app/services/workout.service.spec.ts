import { TestBed } from '@angular/core/testing';
import { WorkoutService, Workout } from './workout.service';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'workoutData') {
        return null;
      }
      return null;
    });

    spyOn(localStorage, 'setItem').and.callFake(() => { });

    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load workout data from localStorage when initialized', () => {
    const mockData = [
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
      }
    ];

    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockData));

    service = TestBed.inject(WorkoutService);

    const workouts = service.getWorkouts();
    expect(workouts.length).toBe(2);
    expect(workouts[0].name).toBe('John Doe');
    expect(workouts[1].workouts[0].type).toBe('Swimming');
  });

  it('should save workout data to localStorage and update the workoutsSubject', () => {
    const newWorkouts: Workout[] = [
      { id: 3, name: 'Mike Johnson', workouts: [{ type: 'Yoga', minutes: 40 }] }
    ];

    service.saveWorkouts(newWorkouts);

    expect(localStorage.setItem).toHaveBeenCalledWith('workoutData', JSON.stringify(newWorkouts));

    service.workouts$.subscribe((workouts) => {
      expect(workouts.length).toBe(1);
      expect(workouts[0].name).toBe('Mike Johnson');
    });
  });

  it('should return workout types', () => {
    const types = service.getWorkoutTypes();
    expect(types).toEqual(['Running', 'Cycling', 'Swimming', 'Yoga']);
  });

  it('should initialize workout data in localStorage if not present', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);

    service = TestBed.inject(WorkoutService);

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

    expect(localStorage.setItem).toHaveBeenCalledWith('workoutData', JSON.stringify(initialData));
  });
});