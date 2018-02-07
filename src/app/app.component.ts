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
    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 400;

    const ctx = this.context;
    if( ctx ) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = this.rectColor;
//      ctx.fillRect( 0, 0, this.rectW, this.rectH );
      ctx.fillRect( (CANVAS_WIDTH - this.rectW) / 2, (CANVAS_HEIGHT - this.rectH) / 2, this.rectW, this.rectH ); // センター基準
    }
  }

  moveW(v): void {
//    console.log('move: '+v);
    this.rectW = v;
  }

  moveH(v): void {
//    console.log('move: '+v);
    this.rectH = v;
  }

  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  getFilenameToUpload(): string {
    if( this.fileToUpload ){
      return this.fileToUpload.name;
    } else {
      return '';
    }
  }

  uploadFileToActivity() {
    console.log('さあ、送信！');
    this.fileUploadService.postFile(this.fileToUpload);
  }

  canvasClick(e) {
    console.log('click at '+ (e.clientX - this.myCanvas.nativeElement.offsetLeft) + ','+ (e.clientY - this.myCanvas.nativeElement.offsetTop));
  }

  canvasMouseUp() {
    console.log('mouseUp');
  }

  canvasMouseDown() {
    console.log('mouseDown');
  }

  canvasMouseOver() {
    console.log('mouseOver');
  }

  canvasMouseOut() {
    console.log('mouseOut');
  }
}
