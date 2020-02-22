import { Component, OnInit, Inject } from '@angular/core';
import {MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

import { StudentsService } from '../students.service';
import { IStudent } from '../interfaces/istudent';
import { IStudentData } from '../interfaces/istudent-data';

@Component({
  selector: 'app-add-student-component',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {
  title: string;
  originalStudentData: IStudentData = {
    name: '',
    speechTherapy: false,
    ocupationalTherapy: false,
    behavioralTherapy: false
  };
  studentData: IStudentData = {...this.originalStudentData};

  constructor(
    private bottomSheetRef: MatBottomSheetRef<AddStudentComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private studentsSvc: StudentsService
  ) {}
  
  ngOnInit() {
    this.setStudentFunctionality(this.data);
  }

  /**
   * Register a new student.
   * A student can be registered without therapies, but not without a name.
   * A randomId is generated for the student since no actual API is implemented.
   * The therapies are gotten from a different function within this one.
   * 
   * @param studentData The form data
   */
  saveChanges(studentData: any): void {
    const validStudent = (
      studentData !== undefined && 
      studentData !== null &&
      studentData.name !== ''
    );

    if(validStudent) {  
      const randomId: number = Math.floor(Math.random() * 500) + 1;
      const therapies: string[] = this.getStudentTherapies(studentData);

      const student: IStudent = {
        id: randomId.toString(),
        name: studentData.name,
        therapies: therapies
      };
  
      this.studentsSvc.addStudent(student).subscribe(student => {
        const isStudentAdded = (
          student.id !== undefined &&
          student.name !== undefined &&
          student.therapies !== undefined
        );
  
        if(isStudentAdded) {
          this.cleanFormFields();
          this.bottomSheetRef.dismiss();
        }
      });
    }
  }

  /**
   * Discard the changes by cleaning the data and close the sheet.
   * Display in console the data that was goign to be stored just for fun.
   */
  discardChanges(studentData: any): void {
    console.table(studentData);
    this.cleanFormFields();
    this.bottomSheetRef.dismiss();
  }

  //#region Private Functions

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
   * Check therapies within the student data. 
   * Add the valid (true) therapies selected to an array.
   * 
   * @param studentData The student data from the form.
   * @returns Empty array when no therapies selected or array with therapies selected. 
   */
  private getStudentTherapies(studentData: any): string[] {
    let therapies = [];
    const validStudent = (studentData !== undefined && studentData !== null);

    if(validStudent) {
      if(studentData.speechTherapy) {
        therapies.push('speech');
      }
      if(studentData.ocupationalTherapy) {
        therapies.push('ocupational');
      }
      if(studentData.behavioralTherapy) {
        therapies.push('behavioral');
      }
    }

    return therapies;
  }

  /**
   * Resets the fields within the form.
   * Does it by resetting the studentData object
   */
  private cleanFormFields() {
    this.studentData.name = '';
    this.studentData.speechTherapy = false;
    this.studentData.ocupationalTherapy = false;
    this.studentData.behavioralTherapy = false;
  }

  //#endregion Private Functions
  
}
