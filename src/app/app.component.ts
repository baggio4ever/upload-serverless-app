import { FileUploadService } from './file-upload.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'upload-serverless-app';

  fileToUpload: File = null;

  constructor( private fileUploadService: FileUploadService ) {
  }

  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  uploadFileToActivity() {
    console.log('さあ、送信！')
    this.fileUploadService.postFile(this.fileToUpload);
  }
}
