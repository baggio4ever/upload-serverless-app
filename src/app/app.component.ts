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
  isMouseDown = false;

  context: CanvasRenderingContext2D;
  animContext: CanvasRenderingContext2D;

  @ViewChild('myCanvas') myCanvas;
  @ViewChild('animCanvas') animCanvas;

  fileToUpload: File = null;

  x = 0;
  y = 0;

  animCanvasWidth = 0;
  animCanvasHeight = 0;

  animX = 0;

  constructor( private fileUploadService: FileUploadService ) {
  }

  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext('2d');

    this.draw();

    const animCanvas = this.animCanvas.nativeElement;
    this.animContext = animCanvas.getContext('2d');
    this.animCanvasWidth = animCanvas.width;
    this.animCanvasHeight = animCanvas.height;

    this.startAnim();
  }

  ngDoCheck() {
    this.draw();
  }

  draw() {
    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 400;

    const ctx = this.context;
    if ( ctx ) {
      // 四角形（UIから大きさ変更できるやつ）
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = this.rectColor;
//      ctx.fillRect( 0, 0, this.rectW, this.rectH );
      ctx.fillRect( (CANVAS_WIDTH - this.rectW) / 2, (CANVAS_HEIGHT - this.rectH) / 2, this.rectW, this.rectH ); // センター基準

      // 四角形（マウス操作に追従する奴）
      const W = 10;
      const H = 10;
      ctx.fillRect(this.x - W / 2, this.y - H / 2, W, H);

      /* この辺を参考にした
        https://developer.mozilla.org/ja/docs/Web/Guide/HTML/Canvas_tutorial/Basic_usage
      */
      ctx.fillStyle = 'rgb(200,0,0)';
      ctx.fillRect( 10, 10, 50, 50 );
      ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
      ctx.fillRect( 30, 30, 50, 50 );

      // 三角
      ctx.beginPath();
      ctx.fillStyle = 'rgba(0, 200, 0, 0.8)';
      ctx.moveTo( 75, 50 );
      ctx.lineTo( 100, 75 );
      ctx.lineTo( 100, 25 );
      ctx.fill();

      // スマイリー
      ctx.beginPath();
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // 外の円
      ctx.moveTo(110, 75);
      ctx.arc(75, 75, 35, 0, Math.PI, false);  // 口 (時計回り)
      ctx.moveTo(65, 65);
      ctx.arc(60, 65, 5, 0, Math. PI * 2, true);  // 左目
      ctx.moveTo(95, 65);
      ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // 右目
      ctx.stroke();
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
    if ( this.fileToUpload ) {
      return this.fileToUpload.name;
    } else {
      return '[ 選択されていません ] ';
    }
  }

  uploadFileToActivity() {
    console.log('さあ、送信！');
    this.fileUploadService.postFile(this.fileToUpload);
  }

  updateXY( e ) {
    const rect = e.target.getBoundingClientRect();
    this.x = e.clientX - rect.left;
    this.y = e.clientY - rect.top;
  }

  canvasClick(e) {
    console.log('click at ' + (e.clientX - this.myCanvas.nativeElement.offsetLeft) + ','
                + (e.clientY - this.myCanvas.nativeElement.offsetTop));

    this.updateXY(e);
//    const rect = e.target.getBoundingClientRect();
//    this.x = e.clientX - rect.left;
//    this.y = e.clientY - rect.top;
  }

  canvasMouseUp(e) {
    console.log('mouseUp');
    this.isMouseDown = false;
  }

  canvasMouseDown(e) {
    console.log('mouseDown');
    this.isMouseDown = true;
    this.updateXY(e);
  }

  canvasMouseOver() {
    console.log('mouseOver');
  }

  canvasMouseOut() {
    console.log('mouseOut');
  }

  canvasMouseMove(e) {
//    console.log('mouseMove');
    if ( this.isMouseDown ) {
      this.updateXY(e);
    }
  }

  canvasKeyDown( e ) {
    console.log('keyDown:' + e.keyCode );
  }

  canvasKeyPress( e ) {
    console.log('keyPress:' + e.charCode );
  }

  canvasKeyUp( e ) {
    console.log('keyUp');
  }

  startAnim(): void {
    setInterval(() => {
      this.animContext.clearRect(0, 0, this.animCanvasWidth, this.animCanvasHeight);

      this.animContext.beginPath();
      this.animContext.strokeRect(this.animX, 0, 10, 10);
      if ( this.animX > this.animCanvasWidth ) {
        this.animX = 0;
      } else {
        this.animX += 1;
      }
    }, 100);
  }
}
