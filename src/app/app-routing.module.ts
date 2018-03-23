import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { JobsComponent } from './file/jobs/jobs.component';
import { BossGuard } from './auth/boss.guard';

const routes: Routes = [
  { path:'', redirectTo:'sage', pathMatch: 'full'},
  { path:'sage', loadChildren: 'app/shared/shared.module#SharedModule'},
  { path:'users', loadChildren: 'app/users/user.module#UserModule', canLoad:[ AdminGuard]},
  { path:'app', component: DashboardComponent,
  loadChildren: 'app/file/file.module#FileModule', canLoad:[AuthGuard]},
  { path:'tasks', component: JobsComponent , canActivate:[BossGuard]},
  { path:'**', redirectTo:'sage', pathMatch: 'full'}
]

@NgModule({
  imports:[
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})

export class AppRoutingModule{

}
