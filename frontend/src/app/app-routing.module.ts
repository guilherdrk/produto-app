import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/produtos', pathMatch: 'full' },
  { path: 'login', loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  {
    path: 'produtos',
    canActivate: [AuthGuard],  // ← protegida!
    loadComponent: () =>
      import('./features/produtos/produto-list/produto-list.component').then(m => m.ProdutoListComponent)
  },
  {
    path: 'produtos/novo',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/produtos/produto-form/produto-form.component').then(m => m.ProdutoFormComponent)
  },
  {
    path: 'produtos/editar/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/produtos/produto-form/produto-form.component').then(m => m.ProdutoFormComponent)
  },
  { path: '**', redirectTo: '/produtos' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
