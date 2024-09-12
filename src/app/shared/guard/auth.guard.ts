import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/user/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router
  ){ }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isLoggedIn = this.authService.isLoggedIn;
    // Verifique se a rota é a de login
    if (next.routeConfig?.path === 'login' || next.routeConfig?.path === 'register-user') {
      if (isLoggedIn) {
        // Se o usuário estiver autenticado e tentar acessar a rota de login, redirecione para a página inicial
        this.router.navigate(['/']);
        return false;
      }
      return true; // Permite o acesso à rota de login se não estiver autenticado
    }

    // Verificação padrão para outras rotas protegidas
    if (!isLoggedIn) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
}
