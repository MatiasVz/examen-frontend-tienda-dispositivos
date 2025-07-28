import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PiePagina } from './pie-pagina';
import { FooterServicio } from '../../servicios/footer-servicio';
import { AuthService } from '../../servicios/auth-service';

describe('PiePagina', () => {
  let component: PiePagina;
  let fixture: ComponentFixture<PiePagina>;
  let mockFooterService: jest.Mocked<FooterServicio>;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    mockFooterService = {
      actualizarRedSocial: jest.fn(),
      getRedesSociales: jest.fn(),
      crearRedSocial: jest.fn(),
      getFooters: jest.fn(),
      getRedesSocialesPorFooter: jest.fn()
    } as any;

    mockAuthService = {
      isAdmin: jest.fn().mockReturnValue(true),
      isLoggedIn: jest.fn().mockReturnValue(true)
    } as any;

    await TestBed.configureTestingModule({
      imports: [PiePagina, FormsModule],
      providers: [
        { provide: FooterServicio, useValue: mockFooterService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PiePagina);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe actualizar red social correctamente', () => {
    // Arrange
    component.redSocialEdit = {
      id: 1,
      nombre: 'facebook',
      url: 'https://facebook.com/techstore-updated',
      footerId: 1
    };
    
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockFooterService.actualizarRedSocial.mockReturnValue(of(component.redSocialEdit));
    mockFooterService.getRedesSocialesPorFooter.mockReturnValue(of([component.redSocialEdit]));

    // Act
    component.actualizarRedSocial();

    // Assert
    expect(mockFooterService.actualizarRedSocial).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        nombre: 'facebook',
        url: 'https://facebook.com/techstore-updated',
        footerId: 1
      })
    );
    expect(alertSpy).toHaveBeenCalledWith('Red social actualizada exitosamente');

    alertSpy.mockRestore();
  });

  it('debe mostrar error si no hay red social seleccionada', () => {
    // Arrange
    component.redSocialEdit = {
      id: undefined,
      nombre: '',
      url: '',
      footerId: 1
    };
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Act
    component.actualizarRedSocial();

    // Assert
    expect(alertSpy).toHaveBeenCalledWith('Selecciona una red social para editar');
    expect(mockFooterService.actualizarRedSocial).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});