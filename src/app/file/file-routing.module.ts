import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FileListComponent } from './file-list/file-list.component';
import { FileLoadComponent } from './file-load/file-load.component';
import { ChangeStatusComponent } from './change-status/change-status.component';
import { FileEditComponent } from './file-edit/file-edit.component';
import { JobsComponent } from './jobs/jobs.component';

const routes: Routes = [
  { path:'', redirectTo:'file', pathMatch: 'full'},
  { path:'file', component: FileListComponent },
  { path:'load', component: FileLoadComponent },
  { path:'status', component: ChangeStatusComponent },
  { path:'file/:id', component: FileEditComponent },

]

@NgModule({
  imports:[
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})

export class FileRoutingModule{

}
