import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from './guards/logged-in.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'categorias', loadChildren: './pages/categorias/categorias.module#CategoriasPageModule' },
  // { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule', canActivate: [LoggedInGuard] },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'agendar', loadChildren: './pages/agendar/agendar.module#AgendarPageModule' },
  { path: 'confirmar', loadChildren: './pages/confirmar/confirmar.module#ConfirmarPageModule' },
  { path: 'orders', loadChildren: './pages/orders/tabs/tabs.module#TabsPageModule', canActivate: [LoggedInGuard] },
  { path: 'get-help', loadChildren: './pages/get-help/get-help.module#GetHelpPageModule', canActivate: [LoggedInGuard] },
  { path: 'rate-popover', loadChildren: './components/rate-popover/rate-popover.module#RatePopoverPageModule' }
  // { path: 'past-orders', loadChildren: './pages/orders/past-orders/past-orders.module#PastOrdersPageModule' },
  // { path: 'upcoming-orders', loadChildren: './pages/orders/upcoming-orders/upcoming-orders.module#UpcomingOrdersPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
