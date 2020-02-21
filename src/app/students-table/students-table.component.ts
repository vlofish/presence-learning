import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { IStudent } from '../interfaces/istudent';
import { StudentsService } from '../students.service';
import { StudentsTableDataSource } from './students-table-datasource';
import { AddStudentComponent } from '../add-student/add-student.component';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.css']
})
export class StudentsTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<IStudent>;

  dataSource: StudentsTableDataSource;
  displayedColumns = ['name', 'id', 'edit'];

  constructor(
    private bottomSheet: MatBottomSheet,
    private studentsSvc: StudentsService
  ) { }

  ngOnInit() {
    this.studentSvcStateObserver();
    this.dataSource = new StudentsTableDataSource(this.studentsSvc);
  }

  ngAfterViewInit() {
    this.setSortAndPaginationOfData();
  }

  /**
   * Opens the bottom dialog in the screen for handling student data
   * 
   * @param action The action to perform with the student data; add or edit.
   * @param studentId The id of the student
   */
  openStudentDialog(action: string, studentId: string): void {
    this.bottomSheet.open(AddStudentComponent, {
      data: {
        action: action,
        studentId: studentId
      },
    });
  }

  /**
   * TODO: Correct reset of pagination missing.
   */
  filterStudents(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.table.dataSource = this.dataSource.filter(filterValue);

    if (filterValue === '') {
      this.setSortAndPaginationOfData();
    }
  }

  deleteStudent(studentId: string) {
    this.studentsSvc.deleteStudent(studentId).subscribe();
    this.table.dataSource = this.dataSource.delete(studentId);
    this.setSortAndPaginationOfData();
  }

  //#region Pivate Functions

  /**
   * Observer of the student state.
   * Listens for any API succeeded or failed call.
   * Based on the state of the student performs an action.
   * 
   * student-added: Connects with the new data(holding the nuew student) and orders the table.
   */
  private studentSvcStateObserver() {
    this.studentsSvc.studentSvcState.subscribe((studentState: string) => {
      if (studentState === 'student-added') {
        this.table.dataSource = this.dataSource.connect();
        this.setSortAndPaginationOfData();
      }
    })
  }

  /**
   * Wrapper for the functionalities in charge of:
   *   sorting, paginating, and displaying the data in the table.
   */
  private setSortAndPaginationOfData() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  //#endregion Private Functions
}
