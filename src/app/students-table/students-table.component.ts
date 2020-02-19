import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { StudentsTableDataSource } from './students-table-datasource';

import {MatBottomSheet} from '@angular/material/bottom-sheet';

import { AddStudentComponent } from '../add-student/add-student.component';
import { IStudent } from '../interfaces/istudent';
import { StudentsService } from '../students.service';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.css']
})
export class StudentsTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<IStudent>;

  dataSource: StudentsTableDataSource;
  displayedColumns = ['name', 'id', 'edit'];

  constructor(
    private _bottomSheet: MatBottomSheet,
    private studentsSvc: StudentsService
  ) {}

  ngOnInit() {
    this.dataSource = new StudentsTableDataSource();
  }

  ngAfterViewInit() {
    this.setSortAndPaginationWithData();
  }

  openStudentDialog(action: string, studentId: string): void {
    this._bottomSheet.open(AddStudentComponent, {
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
    
    if(filterValue === '') {
      this.setSortAndPaginationWithData();
    }
  }

  deleteStudent(studentId:string) {
    this.studentsSvc.deleteStudent(studentId).subscribe();
    this.table.dataSource = this.dataSource.delete(studentId);
    this.setSortAndPaginationWithData();
  }

  private setSortAndPaginationWithData() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
