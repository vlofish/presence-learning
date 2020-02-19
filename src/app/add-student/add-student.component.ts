import { Component, OnInit, Inject } from '@angular/core';
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

import { StudentsService } from '../students.service';
import { IStudent } from '../interfaces/istudent';

@Component({
  selector: 'app-add-student-component',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {
  title: string;
  studentName = '';
  studentTherapies = { //An interface would work; not added for lack of time.
    speech: false,
    ocupational: false,
    behavioral: false
  };

  constructor(
    private bottomSheetRef: MatBottomSheetRef<AddStudentComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private studentsSvc: StudentsService
  ) {}
  
  ngOnInit() {
    this.setStudentFunctionality(this.data);
  }

  /**
   * 
   */
  saveChanges(): void {
    const randomId: number = Math.floor(Math.random() * 500) + 1;
    const therapies: string[] = this.getStudentTherapies();

    if(this.studentName !== '') {
      const student: IStudent = {
        id: randomId.toString(),
        name: this.studentName,
        therapies: therapies
      };
  
      this.studentsSvc.addStudent(student).subscribe(student => {
        const studentAdded = (
          student.id !== undefined &&
          student.name !== undefined &&
          student.therapies !== undefined
        );
  
        if(studentAdded) {
          this.cleanAllFields();
          this.bottomSheetRef.dismiss();
        }
      });
    }
  }

  /**
   * Close the bottom sheet and clean any data from the user
   */
  discardChanges(): void {
    this.cleanAllFields();
    this.bottomSheetRef.dismiss();
  }

  private setStudentFunctionality(data) {
    if(data.action === 'add'){
      this.title = 'Add';
    } else { // edit
      this.title = 'Missing Impl for Edit';
      this.getStudent(data.studentId)
    }
  }

  private getStudent(student: string) {
    this.studentsSvc.getStudent(student).subscribe((student) => {
      this.setStudentValuesForEdit(student);
    });
  }

  /**
   * Missing time for implementation
   * TODO: finish this implementation
   * @param student 
   */
  private setStudentValuesForEdit(student: IStudent) {
    throw new Error("Method not implemented.");
  }


  /**
   * Check therapies object. 
   * Then add the therapies selected to an string array;
   */
  private getStudentTherapies(): string[] {
    let therapies = [];

    if(this.studentTherapies.speech) {
      therapies.push('speech');
    }
    if(this.studentTherapies.ocupational) {
      therapies.push('ocupational');
    }
    if(this.studentTherapies.behavioral) {
      therapies.push('behavioral');
    }

    return therapies;
  }

  private cleanAllFields() {
    this.studentName = '';
    this.studentTherapies.behavioral = false;
    this.studentTherapies.ocupational = false;
    this.studentTherapies.speech = false;
  }
  
}
