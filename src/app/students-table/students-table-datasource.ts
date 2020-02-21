import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

import { IStudent } from '../interfaces/istudent';
import { StudentsService } from '../students.service';
import { STUDENT_MOCK } from '../mocks/data/student-mock'

export class StudentsTableDataSource extends DataSource<IStudent> {
  data: IStudent[] = [];
  paginator: MatPaginator;
  sort: MatSort;

  constructor(
    private studentSvc: StudentsService
  ) {
    super();
  }

  /** 
   * @param filterValue 
   */
  filter(filterValue: string): Observable <IStudent[]> {
    const matTblDataSrc = new MatTableDataSource(this.data);
    matTblDataSrc.filter = filterValue.trim().toLowerCase()

    return observableOf<IStudent[]>(matTblDataSrc.filteredData);
  }

  /**
   * @param itemId 
   */
  delete(itemId: string): Observable <IStudent[]> {
    let itemIndex: number;
    
    this.data.forEach((data, index) => {
      if(data.id === itemId) {
         itemIndex = index;
      }
    });

    if(itemIndex !== undefined) {
      this.data.splice(itemIndex, 1);
    }
    
    return observableOf<IStudent[]>(this.data);
  }

  connect(): Observable<IStudent[]> {
    const observableStudents = this.studentSvc.getStudents().pipe(map((students) => {
      this.data = students;
      this.getPagedData(this.getSortedData([...this.data]));
    }))

    const dataMutations = [
      observableStudents,
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    })); 
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: IStudent[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: IStudent[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}