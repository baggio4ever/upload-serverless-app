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
  rectAngle = 0;
  isMouseDown = false;

  myPattern = null;

  context: CanvasRenderingContext2D;
  animContext: CanvasRenderingContext2D;
  animEarthContext: CanvasRenderingContext2D;

  @ViewChild('myCanvas') myCanvas;
  @ViewChild('animCanvas') animCanvas;
  @ViewChild('animEarth') animEarth;

  fileToUpload: File = null;

  x = 20;
  y = 20;

  animCanvasWidth = 0;
  animCanvasHeight = 0;

  animX = 0;

  ball = null;

  sun = new Image();
  earth = new Image();
  moon = new Image();

  constructor( private fileUploadService: FileUploadService ) {
  }

  ngAfterViewInit() {
    // myCanvas
    const canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext('2d');

    this.draw();

    // animCanvas
    const animCanvas = this.animCanvas.nativeElement;
    this.animContext = animCanvas.getContext('2d');
    this.animCanvasWidth = animCanvas.width;
    this.animCanvasHeight = animCanvas.height;

    const img = new Image();
    img.src = '../assets/images/images.jpg';
    img.onload = () => {
      this.myPattern = this.context.createPattern(img, 'repeat');
    };

    const img_ball = new Image();
    img_ball.src = '../assets/images/football-157930_960_720.png';
    img_ball.onload = () => {
      this.ball = img_ball; // まわりくどいね
    };

    this.startAnim();


    // animEarth
    const animEarthCanvas = this.animEarth.nativeElement;
    this.animEarthContext = animEarthCanvas.getContext('2d');

    this.sun.src = '../assets/images/Canvas_sun.png';
    this.earth.src = '../assets/images/Canvas_earth.png';
    this.moon.src = '../assets/images/Canvas_moon.png';

    requestAnimationFrame( ()=>{
      console.log('ooooh');
      this.drawEarth();
    });
  }

  drawEarth() {
/*    if ( this.animEarthContext == null ) {
          console.log('this:'+this);
          window.requestAnimationFrame( ()=> {this.drawEarth();});
           return; 
    }
*/
    const ctx = this.animEarthContext;

    ctx.globalCompositeOperation = 'destination-over'; // destination-over: 新たな図形は、描画先 Canvas の内容の背後に描かれます。
    ctx.clearRect(0, 0, 300, 300); // clear canvas

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeStyle = 'rgba(0,153,255,0.4)';
    ctx.save();
    ctx.translate(150, 150);  // Canvas_sun.png は、300x300の大きさ

    // Earth
    const time = new Date();
    ctx.rotate( ((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds() );
    ctx.translate(105, 0);
    ctx.fillRect(0, -12, 50, 24); // Shadow （これのおかげで場所によって月が暗くなるみたい）
    ctx.drawImage(this.earth, -12, -12); // Canvas_earth.png は、24x24の大きさ

    // Moon
    ctx.save();
    ctx.rotate( ((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds() );
    ctx.translate(0, 28.5);
    ctx.drawImage(this.moon, -3.5, -3.5); // Canvas_moon.png は、7x7の大きさ
    ctx.restore();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
    ctx.stroke();

    ctx.drawImage(this.sun, 0, 0, 300, 300);

    window.requestAnimationFrame( () => { this.drawEarth(); } );
  }

  ngDoCheck() {
    this.draw();
  }

  draw() {
    const CANVAS_WIDTH = 600;
    const CANVAS_HEIGHT = 400;

    const ctx = this.context;
    if ( ctx ) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 芝生パターン
      ctx.fillStyle = this.myPattern;
      ctx.fillRect( 10, 10, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20);

      // 四角形（UIから大きさ変更できるやつ）
      ctx.save();
      ctx.translate( CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 );
      ctx.rotate(this.getRadianFromDegree(this.rectAngle));
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = this.rectColor;
//      ctx.fillRect( 0, 0, this.rectW, this.rectH );
      ctx.fillRect( (/*CANVAS_WIDTH*/ - this.rectW) / 2, (/*CANVAS_HEIGHT*/ - this.rectH) / 2, this.rectW, this.rectH ); // センター基準
      ctx.restore();


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
      ctx.save();
      ctx.translate( 200, 200 );
      ctx.strokeStyle = 'white';
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
      ctx.restore();

      // 二次曲線の例　吹き出し
      ctx.save();
      ctx.translate( 20, 100 );
      ctx.strokeStyle = 'white';
      const offsetY = 0;
      ctx.beginPath();
      ctx.moveTo(75, 25 + offsetY);
      ctx.quadraticCurveTo(25, 25 + offsetY, 25, 62.5 + offsetY);
      ctx.quadraticCurveTo(25, 100 + offsetY, 50, 100 + offsetY);
      ctx.quadraticCurveTo(50, 120 + offsetY, 30, 125 + offsetY);
      ctx.quadraticCurveTo(60, 120 + offsetY, 65, 100 + offsetY);
      ctx.quadraticCurveTo(125, 100 + offsetY, 125, 62.5 + offsetY);
      ctx.quadraticCurveTo(125, 25 + offsetY, 75, 25 + offsetY);
      ctx.stroke();
      ctx.restore();

      // 三次ベジェ曲線の例　ハート
      ctx.save();
      ctx.translate( 200, 0 );
      const offsetX = 0;
      ctx.fillStyle = 'rgba(200,10,10,0.8)';
      ctx.beginPath();
      ctx.moveTo(75 + offsetX, 40);
      ctx.bezierCurveTo(75 + offsetX, 37, 70 + offsetX, 25, 50 + offsetX, 25);
      ctx.bezierCurveTo(20 + offsetX, 25, 20 + offsetX, 62.5, 20 + offsetX, 62.5);
      ctx.bezierCurveTo(20 + offsetX, 80, 40 + offsetX, 102, 75 + offsetX, 120);
      ctx.bezierCurveTo(110 + offsetX, 102, 130 + offsetX, 80, 130 + offsetX, 62.5);
      ctx.bezierCurveTo(130 + offsetX, 62.5, 130 + offsetX, 25, 100 + offsetX, 25);
      ctx.bezierCurveTo(85 + offsetX, 25, 75 + offsetX, 37, 75 + offsetX, 40);
      ctx.fill();
      ctx.restore();

      // 半透明サンプル globalAlpha
      // draw background
      ctx.save();
      ctx.translate( 400, 0 );
      const offsetX2 = 0;
      ctx.fillStyle = '#FD0';
      ctx.fillRect(0 + offsetX2, 0, 75, 75);
      ctx.fillStyle = '#6C0';
      ctx.fillRect(75 + offsetX2, 0, 75, 75);
      ctx.fillStyle = '#09F';
      ctx.fillRect(0 + offsetX2, 75, 75, 75);
      ctx.fillStyle = '#F30';
      ctx.fillRect(75 + offsetX2, 75, 75, 75);
      ctx.fillStyle = '#FFF';

      // set transparency value
      ctx.globalAlpha = 0.2;

      // Draw semi transparent circles
      for (let i = 0; i < 7; i++){
        ctx.beginPath();
        ctx.arc(75 + offsetX2, 75, 10 + 10 * i, 0, Math.PI * 2, true);
        ctx.fill();
      }
      ctx.restore();
//      ctx.globalAlpha = 1.0;

      // text
      ctx.font = '48px serif';
      const t = 'think your own strategy';
      const m = ctx.measureText(t);
      ctx.fillStyle = 'white';
      ctx.fillText(t, (CANVAS_WIDTH - m.width) / 2, CANVAS_HEIGHT - 30); // センタリング
//      ctx.strokeText('think your own strategy',30,CANVAS_HEIGHT-30);

      // ball （マウス操作に追従する奴）
      this.drawBall( ctx );
/*
      if ( this.ball ) {
        ctx.drawImage(this.ball, 100, 100, 40, 40);
      }


      // 四角形（マウス操作に追従する奴）
      ctx.fillStyle = this.rectColor;
      const W = 10;
      const H = 10;
      ctx.fillRect(this.x - W / 2, this.y - H / 2, W, H);
*/
    }
  }

  drawBall(ctx): void {
    const BALL_WIDTH = 40;
    const BALL_HEIGHT = 40;
    if ( this.ball ) {
        ctx.drawImage(this.ball, this.x - BALL_WIDTH / 2, this.y - BALL_HEIGHT / 2, BALL_WIDTH, BALL_HEIGHT);
    }
  }

  // 度からラジアンに変換
  getRadianFromDegree( degree: number ): number {
    return (Math.PI / 180) * degree;
  }

  moveW(v): void {
//    console.log('move: '+v);
    this.rectW = v;
  }

  moveH(v): void {
//    console.log('move: '+v);
    this.rectH = v;
  }

  moveAngle(v): void {
//    console.log('move: '+v);
    this.rectAngle = v;
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
