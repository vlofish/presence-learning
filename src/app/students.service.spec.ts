import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { IStudent } from './interfaces/istudent';
import { STUDENT_MOCK } from './mocks/data/student-mock';
import { StudentsService } from './students.service';

describe('StudentService Suite', () => {
  let studentSvc: StudentsService,
      httpTestCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentsService]
    })

    studentSvc = TestBed.get(StudentsService);
    httpTestCtrl = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(studentSvc).toBeTruthy();
  });

  describe('Get Students Suite', () => {
    let testRequest: TestRequest;

    afterEach(() => {
      httpTestCtrl.verify();
    });

    it('should get all students by calling them once', () => {
      const xpctdStudents: IStudent[] = STUDENT_MOCK;

      studentSvc.getStudents().subscribe((students) => {
        expect(students.length).toBeGreaterThan(0);
      });

      testRequest = httpTestCtrl.expectOne(studentSvc.url.students);
      expect(testRequest.request.method).toBe('GET');

      testRequest.flush(xpctdStudents);
    });

    it('should be ok when no students are received', () => {
      studentSvc.getStudents().subscribe((students) => {
        expect(students.length).toBe(0);
      });

      testRequest = httpTestCtrl.expectOne(studentSvc.url.students);
      expect(testRequest.request.method).toBe('GET');

      testRequest.flush([]);
    });

    
    it('should turn a 404 into an empty array of students', () => {
      studentSvc.getStudents().subscribe((students) => {
        expect(students.length).toBe(0);
      });

      testRequest = httpTestCtrl.expectOne(studentSvc.url.students);
      expect(testRequest.request.method).toBe('GET');

      testRequest.flush('On purpose 404', {status: 404, statusText: 'Not Found'})
    });

  });
});
