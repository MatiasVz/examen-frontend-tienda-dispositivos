import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { UsuarioComponent } from './usuario-component';
import { UsuarioService } from '../../servicios/usuario-service';

describe('UsuarioComponent', () => {
  let component: UsuarioComponent;
  let fixture: ComponentFixture<UsuarioComponent>;
  let mockUsuarioService: jest.Mocked<UsuarioService>;

  beforeEach(async () => {
    mockUsuarioService = {
      getUsuarios: jest.fn(),
      actualizarUsuario: jest.fn(),
      crearUsuario: jest.fn(),
      eliminarUsuario: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [UsuarioComponent, FormsModule],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioComponent);
    component = fixture.componentInstance;
    
    // Inicializar usuario vacío (como lo hace el componente real)
    component.usuarioSeleccionado = {
      secuencial: 0,
      nombre: '',
      apellido: '',
      telefono: '',
      username: '',
      password: '',
      estaActivo: 1,
      tipoUsuario: { secuencial: 0, nombre: '' }
    };
    
    // CAMBIAR ESTA LÍNEA - usar sintaxis de Jest
    mockUsuarioService.getUsuarios.mockReturnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe actualizar usuario cuando está en modo edición', () => {
    // Arrange
    component.editando = true;
    component.usuarioSeleccionado = {
      secuencial: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '0987654321',
      username: 'jperez',
      password: '123456',
      estaActivo: 1,
      tipoUsuario: { secuencial: 1, nombre: 'admin' }
    };
    
    mockUsuarioService.actualizarUsuario.mockReturnValue(of(component.usuarioSeleccionado));
    mockUsuarioService.getUsuarios.mockReturnValue(of([component.usuarioSeleccionado]));

    // Act
    component.guardarUsuario();

    // Assert
    expect(mockUsuarioService.actualizarUsuario).toHaveBeenCalled();
    expect(mockUsuarioService.getUsuarios).toHaveBeenCalled();
  });

  it('debe seleccionar usuario para edición', () => {
    // Arrange
    const usuario = {
      secuencial: 2,
      nombre: 'María',
      apellido: 'García',
      telefono: '0987654322',
      username: 'mgarcia',
      password: '123456',
      estaActivo: 1,
      tipoUsuario: { secuencial: 2, nombre: 'usuario' }
    };

    // Act
    component.seleccionarUsuario(usuario);

    // Assert
    expect(component.usuarioSeleccionado).toEqual(usuario);
    expect(component.editando).toBe(true);
  });

  it('debe crear nuevo usuario cuando no está editando', () => {
    // Arrange
    component.editando = false;
    component.usuarioSeleccionado = {
      secuencial: 0,
      nombre: 'Carlos',
      apellido: 'López',
      telefono: '0987654323',
      username: 'clopez',
      password: '123456',
      estaActivo: 1,
      tipoUsuario: { secuencial: 2, nombre: 'usuario' }
    };
    
    mockUsuarioService.crearUsuario.mockReturnValue(of(component.usuarioSeleccionado));
    mockUsuarioService.getUsuarios.mockReturnValue(of([component.usuarioSeleccionado]));

    // Act
    component.guardarUsuario();

    // Assert
    expect(mockUsuarioService.crearUsuario).toHaveBeenCalled();
    expect(mockUsuarioService.getUsuarios).toHaveBeenCalled();
  });
});