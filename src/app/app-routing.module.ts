import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'app/graph', pathMatch: 'full' },
  { path: 'app', redirectTo: 'app/graph', pathMatch: 'full' },
  { path: 'app/graph', loadChildren: './graph/graph.module#GraphModule', pathMatch: 'full' },
  { path: 'app/grid', loadChildren: './grid/grid.module#GridModule', pathMatch: 'full' },
  { path: 'app/about', loadChildren: './about/about.module#AboutModule', pathMatch: 'full'  }
];

const config: ExtraOptions = {
  useHash: false,
  preloadingStrategy: PreloadAllModules
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
