import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileRoutingModule } from './file-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FileListComponent } from './file-list/file-list.component';
import { FileLoadComponent } from './file-load/file-load.component';
import { ChangeStatusComponent } from './change-status/change-status.component';
import { JobsComponent } from './jobs/jobs.component';
import { FileEditComponent } from './file-edit/file-edit.component';
import { FileService } from './file.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FileRoutingModule,
    SharedModule
  ],
  declarations: [
    FileListComponent,
    FileLoadComponent,
    ChangeStatusComponent,
    FileEditComponent,
    JobsComponent
  ],
  providers: [
    FileService
  ]
})
export class FileModule { }
