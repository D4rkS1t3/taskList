import { Component, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faCheck, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todoapk';
  faCheck = faCheck;
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;

  @ViewChild('myModal') model: ElementRef | undefined;
  taskObj: Task = new Task();
  taskList: Task[] = [];
  isEditMode: boolean = false;
  selectedFile: File | null=null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const localData = localStorage.getItem("taskList");
      if (localData != null) {
        this.taskList = JSON.parse(localData);
      }
    }
  }

  openModel() {
    const model = document.getElementById("myModal");
    if (model != null) {
      model.style.display = 'block';
    }
  }

  closeModel() {
    this.taskObj = new Task();
    this.isEditMode = false; // Reset trybu edycji
    this.selectedFile=null;
    if (this.model != null) {
      this.model.nativeElement.style.display = 'none';
    }
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.taskObj.avatar = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveTask() {
    if (!this.taskObj.task) { // Warunek sprawdzający czy treść taska została wprowadzona
      alert("Please enter task content!");
      return;
    }

    if (this.isEditMode) {
      this.updateTask();
    } else {
      this.addTask();
    }
  }

  addTask() {
    if (isPlatformBrowser(this.platformId)) {
      const isLocalPresent = localStorage.getItem("taskList");
      if (isLocalPresent != null) {
        const oldArray = JSON.parse(isLocalPresent);
        this.taskObj.id = oldArray.length + 1;
        oldArray.push(this.taskObj);
        this.taskList = oldArray;
        localStorage.setItem('taskList', JSON.stringify(oldArray));
      } else {
        const newArr = [];
        this.taskObj.id = 1;
        newArr.push(this.taskObj);
        this.taskList = newArr;
        localStorage.setItem('taskList', JSON.stringify(newArr));
      }
      this.closeModel();
    }
  }

  onDelete(item: Task) {
    if (isPlatformBrowser(this.platformId)) {
      const isDelete = confirm("Are you sure you want to delete this task?");
      if (isDelete) {
        const currentRecord = this.taskList.findIndex(m => m.id === item.id);
        this.taskList.splice(currentRecord, 1);
        localStorage.setItem('taskList', JSON.stringify(this.taskList));
      }
    }
  }

  onEdit(item: Task) {
    this.taskObj = { ...item }; // Kopia obiektu, aby edycja była niezależna
    this.isEditMode = true; // Ustaw tryb edycji
    this.openModel();
  }

  updateTask() {
    if (isPlatformBrowser(this.platformId)) {
      const currentRecordIndex = this.taskList.findIndex(m => m.id === this.taskObj.id);
      if (currentRecordIndex !== -1) {
        this.taskList[currentRecordIndex] = { ...this.taskObj };
        localStorage.setItem('taskList', JSON.stringify(this.taskList));
      }
      this.closeModel();
    }
  }
}

export class Task {
  id: number;
  member: string;
  task: string;
  priority: string;
  avatar: string;

  constructor() {
    this.id = 0;
    this.member = '';
    this.task = '';
    this.priority = '';
    this.avatar='';
  }
}
