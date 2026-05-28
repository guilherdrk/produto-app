import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  canActivate(): boolean | UrlTree {
    if(this.authService.isAutenticado()){
      return true;
    }
    // Redireciona para login se não autenticado
    return this.router.createUrlTree(['/login']);
  }
}
