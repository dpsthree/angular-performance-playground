import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
  ExtraOptions,
  PreloadAllModules
} from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'app/graph', pathMatch: 'full' },
  { path: 'app', redirectTo: 'app/graph', pathMatch: 'full' },
  {
    path: 'app/graph',
    loadChildren: () => import('./graph/graph.module').then(m => m.GraphModule),
    pathMatch: 'full'
  },
  {
    path: 'app/grid',
    loadChildren: () => import('./grid/grid.module').then(m => m.GridModule),
    pathMatch: 'full'
  },
  {
    path: 'app/about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
    pathMatch: 'full'
  }
];

const config: ExtraOptions = {
  useHash: false,
  preloadingStrategy: PreloadAllModules
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
