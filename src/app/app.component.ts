import { FileUploadService } from './file-upload.service';
import { Component } from '@angular/core';
import { ViewChild, AfterViewInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, DoCheck {
  title = 'upload-serverless-app';

  rectW = 100;
  rectH = 100;
  rectColor = '#FF0000';

  context: CanvasRenderingContext2D;

  @ViewChild('myCanvas') myCanvas;

  fileToUpload: File = null;

  constructor( private fileUploadService: FileUploadService ) {
  }

  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext('2d');

    this.draw();
  }

  ngDoCheck() {
    this.draw();
  }

  draw() {
    const ctx = this.context;
    if( ctx ) {
      ctx.clearRect(0,0,400,400);
      ctx.fillStyle = this.rectColor;
      ctx.fillRect( 0,0,this.rectW,this.rectH );
    }
  }

  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  uploadFileToActivity() {
    console.log('さあ、送信！')
    this.fileUploadService.postFile(this.fileToUpload);
  }
}
