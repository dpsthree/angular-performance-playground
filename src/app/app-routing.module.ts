import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'graph', pathMatch: 'full' },
  { path: 'graph', loadChildren: './graph/graph.module#GraphModule' },
  { path: 'about', loadChildren: './about/about.module#AboutModule' },
  { path: 'grid', loadChildren: './grid/grid.module#GridModule' }
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
