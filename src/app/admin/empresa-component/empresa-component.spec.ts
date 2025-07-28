import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { EmpresaComponent } from './empresa-component';
import { EmpresaServicio } from '../../servicios/empresa-servicio';

describe('EmpresaComponent', () => {
  let component: EmpresaComponent;
  let fixture: ComponentFixture<EmpresaComponent>;
  let mockEmpresaService: jest.Mocked<EmpresaServicio>;

  beforeEach(async () => {
    mockEmpresaService = {
      getEmpresas: jest.fn(),
      updateEmpresa: jest.fn(),
      crearEmpresa: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [EmpresaComponent, FormsModule],
      providers: [
        { provide: EmpresaServicio, useValue: mockEmpresaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresaComponent);
    component = fixture.componentInstance;
    
    // Configurar empresa inicial
    component.empresa = {
      secuencial: 1,
      nombre: 'TechStore',
      logo: 'assets/logo.png',
      mision: 'Brindar tecnología de calidad',
      vision: 'Ser líderes en tecnología',
      anio: '2024',
      realizadopor: 'Equipo TechStore',
      banners: []
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe actualizar la empresa correctamente', () => {
    // Arrange
    component.empresa.nombre = 'TechStore Premium';
    component.empresa.mision = 'Nueva misión actualizada';
    const empresaActualizada = { ...component.empresa };
    
    mockEmpresaService.updateEmpresa.mockReturnValue(of(empresaActualizada));

    // Act
    component.guardarCambios();

    // Assert
    expect(mockEmpresaService.updateEmpresa).toHaveBeenCalledWith(
      component.empresa.secuencial,
      expect.objectContaining({
        nombre: 'TechStore Premium',
        mision: 'Nueva misión actualizada'
      })
    );
  });

  it('debe manejar errores al actualizar empresa', () => {
    // Arrange
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockEmpresaService.updateEmpresa.mockReturnValue(
      throwError(() => new Error('Error del servidor'))
    );

    // Act
    component.guardarCambios();

    // Assert
    expect(alertSpy).toHaveBeenCalledWith('Error al guardar los datos');
    expect(mockEmpresaService.updateEmpresa).toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});