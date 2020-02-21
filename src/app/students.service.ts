import { Injectable } from "@angular/core";

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of as observableOf, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { IStudent } from './interfaces/istudent';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  url = {
    students: 'api/students'
  };

  public studentSvcState = new BehaviorSubject<string>('');

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { };

  /**
   * Get all students
   */
  getStudents(): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(this.url.students)
      .pipe(
        catchError(this.handleError('getStudents', []))
      );
  }

  /**
   * Get a single student
   * @param studentId 
   */
  getStudent(studentId: string): Observable<IStudent> {
    const url = `${this.url.students}/?id=${studentId}`;

    return this.http.get<IStudent>(url)
      .pipe(
        tap(student => console.log("Gotten student: " + student[0].name)),
        catchError(this.handleError('getStudent', []))
      );
  }

  /**
   * Delete a single student
   * @param studentId 
   */
  deleteStudent(studentId: string): Observable<IStudent> {
    const url = `${this.url.students}/${studentId}`;

    return this.http.delete<IStudent>(url, this.httpOptions)
      .pipe(catchError(this.handleError('deleteStudent', [])));
  }

  /**
   * Add a single student
   * @param student 
   */
  addStudent(student: IStudent): Observable<IStudent> {


    return this.http.post<IStudent>(this.url.students, student, this.httpOptions)
      .pipe(
        tap((student) => {
          if (student.id) {
            this.studentSvcState.next('student-added');
          } else {
            this.studentSvcState.next('student-not-added');
          }
        }),
        catchError(this.handleError('addStudent', []))
      );
  }

  /**
   * Show us the errors in the console,dev purpose only.
   * @param operationName 
   * @param result 
   */
  private handleError(operationName, result) {
    return ((error: HttpErrorResponse) => {
      console.error('Error with ' + operationName);
      console.error('Type of error ' + error.message);
      return observableOf(result);
    });
  }

}