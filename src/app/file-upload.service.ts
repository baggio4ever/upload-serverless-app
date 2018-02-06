import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class FileUploadService {

  constructor(private http: HttpClient) { }

  postFile(fileToUpload: File): void {
    const endpoint = 'https://aydpfd6q18.execute-api.ap-southeast-2.amazonaws.com/dev/save';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);

    const header = new HttpHeaders().set('Content-Type','image/jpeg');
    this.http.post(endpoint, fileToUpload, { headers: header })
            .subscribe( data => { console.log('data:'+data) });
  }

  handleError(e) {
  }
}
