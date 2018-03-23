import { Component, OnInit, ViewChild, ViewContainerRef, Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { File } from '../file';
import { StorageService } from '../../shared/storage.service';
import { FileService } from '../../file/file.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
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
  selector: 'sage-file-load',
  templateUrl: './file-load.component.html',
  styleUrls: ['./file-load.component.css'],
  providers: [
    I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ]
})
export class FileLoadComponent implements OnInit {

  fileForm: FormGroup;
  file:File = new File();
  label:string='Seleccionar archivo...';
  @ViewChild('fileInput') fileInput;
  date:NgbDateStruct;

  constructor(
    private fb: FormBuilder,
    private fileService:FileService,
    private storageService: StorageService,
    private toastr:ToastsManager,
    private vcr: ViewContainerRef
  )
  {
    toastr.setRootViewContainerRef(this.vcr);
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

  ngOnInit() {
    this.createForm();
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
    let file: File = new File();
    file.file_code = formModel.file_code as string;
    file.description = formModel.description as string;
    file.comments = formModel.comments as string;
    file.images_path = [];
    if(formModel.time_limit !== undefined){
      file.time_limit = new Date(
        formModel.time_limit.year,
        formModel.time_limit.month-1,
        formModel.time_limit.day);
    }
    return file;
  }

  reset(){
    this.label = "Seleccionar archivo...";
    this.fileInput.nativeElement.value="";
  }

  onSubmit(){
    this.file = this.prepareSubmitFile();
    console.log(this.file);
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
    this.fileService.create([this.file]).subscribe(
      res=>{
        this.toastr.success('Codigo: '+this.file.file_code, 'Expte creado exitosamente');
        this.reset();
        this.createForm();
      },
      error=>{
        this.toastr.error('Se produjo un error');
      }
    );
  }

}
