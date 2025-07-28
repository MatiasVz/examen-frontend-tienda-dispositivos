import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login-component';
import { AuthService } from '../../servicios/auth-service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
      isLoggedIn: jest.fn(),
      logout: jest.fn(),
      isAdmin: jest.fn()
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar error si las credenciales son incorrectas', () => {
    // Arrange
    component.username = 'usuario@incorrecto.com';
    component.password = 'passwordIncorrecto';
    mockAuthService.login.mockReturnValue(throwError(() => new Error('Credenciales inválidas')));

    // Act
    component.iniciarSesion();

    // Assert
    expect(component.errorMsg).toBeTruthy();
    expect(mockAuthService.login).toHaveBeenCalledWith('usuario@incorrecto.com', 'passwordIncorrecto');
  });

  it('debe navegar al dashboard cuando el login es exitoso', () => {
    // Arrange
    component.username = 'admin@techstore.com';
    component.password = 'admin123';
    mockAuthService.login.mockReturnValue(of({ 
      token: 'fake-token', 
      user: { username: 'admin', tipo: 'admin' } 
    }));

    // Act
    component.iniciarSesion();

    // Assert
    expect(mockAuthService.login).toHaveBeenCalledWith('admin@techstore.com', 'admin123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});