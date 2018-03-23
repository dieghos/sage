import { Component, OnInit, ViewContainerRef, ViewChild, Injectable } from '@angular/core';
import { File } from '../file';
import { FileService } from '../file.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StorageService } from '../../shared/storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';
import { isNumber, toInteger, padNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  'es': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  }
  // other languages you would support
};

@Injectable()
export class I18n {
  language = 'es';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
}

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return {day: toInteger(dateParts[0]), month: null, year: null};
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: null};
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: toInteger(dateParts[2])};
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date ?
        `${isNumber(date.day) ? padNumber(date.day) : ''}-${isNumber(date.month) ? padNumber(date.month) : ''}-${date.year}` :
        '';
  }
}


@Component({
  selector: 'sage-file-edit',
  templateUrl: './file-edit.component.html',
  providers: [
    I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ],
  styleUrls:[ './file-edit.component.css' ]
})
export class FileEditComponent implements OnInit {
  current_image;
  file:File = new File();
  @ViewChild('fileInput') fileInput;
  label:string='Seleccionar archivo...';
  fileForm: FormGroup;
  date:NgbDateStruct;
  modalRef;

  constructor(
    private fb: FormBuilder,
    private route:ActivatedRoute,
    private router: Router,
    private fileService:FileService,
    private storageService: StorageService,
    private modalService: NgbModal,
    vcr: ViewContainerRef,
    private toastr:ToastsManager
  ){
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(){
    this.createForm();
    this.route.paramMap
    .switchMap((params: ParamMap) => this.fileService.getFilesById(params.get('id')))
    .subscribe(
      (res:any) => {
        this.file = res.file;
        this.patchForm();
      },
      error=>{
        console.error(error);
      }
    );
  }

  createForm(){
    this.fileForm = this.fb.group({
      file_code: ['', Validators.required],
      description:['', Validators.required],
      time_limit:'',
      comments:'',
      etx:''
    });
  }

  patchForm(){
    let date = moment(this.file.time_limit);

    this.fileForm.patchValue({
      file_code: this.file.file_code,
      description: this.file.description,
      time_limit: {
        year: date.year(),
        month: date.month()+1,
        day: date.date()},
      etx: this.file.etx,
      comments: this.file.comments
    });
  }


  handleFileInput(files: FileList) {
    if(files.length > 0){
      if(files.length > 1){
        this.label = files.length + " archivos.";

      }else{
        this.label = files.item(0).name;
      }
    }else{
      this.label = 'Seleccionar archivo...';
    }
  }

  prepareSubmitFile(): File {
    const formModel = this.fileForm.value;
    let images = this.file.images_path;
    let file: File = new File();
    file._id = this.file._id;
    file.file_code = formModel.file_code as string;
    file.description = formModel.description as string;
    file.comments = formModel.comments as string;
    file.images_path = images;
    if(formModel.time_limit !== undefined){
      file.time_limit = new Date(
        formModel.time_limit.year,
        formModel.time_limit.month-1,
        formModel.time_limit.day);
    }
    return file;
  }


  onSubmit(){
    this.file = this.prepareSubmitFile();
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      for(var i=0;i<fileBrowser.files.length;i++){
        formData.append("image", fileBrowser.files[i]);
      }
      this.storageService.upload(formData).subscribe(
        (res:any)=>{
          for(var i=0; i< res.files.length;i++){
            this.file.images_path.push("assets/images/"+res.files[i].filename);
          }
          this.saveFile();
        },
        error=>{
          this.toastr.error('Se produjo un error');
        }
      );
    }
    else{
      this.saveFile();
    }
  }

  // Guarda el expediente en la base de datos
  saveFile(){
    this.fileService.update(this.file).subscribe(
      res=>{
        this.toastr.success('Codigo: '+this.file.file_code, 'Expte actualizado exitosamente');
        setTimeout(() => {
          this.router.navigateByUrl('app/file')
        }, 2500);
      },
      error=>{
        this.toastr.error('Se produjo un error');
        console.error(error);
      }
    );
  }

  showModal(images, image){
    this.modalRef = this.modalService.open(images);
    this.current_image = image;
  }

  deletePhoto(){
    this.storageService.delete(this.current_image)
      .subscribe(
        (res:any)=>{
          this.file.images_path.splice(this.file.images_path.indexOf(res.path),1);
          this.fileService.update(this.file).subscribe(
            //Reference to image
          );
          this.modalRef.close();
          this.toastr.success('Imagen eliminada');
        },
        err=>{
          console.error(err);
        }
      );
  }
}
