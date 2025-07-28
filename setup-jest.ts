// Configuración básica de Jest para Angular sin importaciones problemáticas

// Configurar Zone.js para Angular
import 'zone.js';
import 'zone.js/testing';

// Configurar performance API
global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
} as any;

// Mock global para window.alert
Object.defineProperty(window, 'alert', {
  writable: true,
  value: jest.fn()
});

// Mock para console
Object.defineProperty(console, 'warn', {
  writable: true,
  value: jest.fn()
});

Object.defineProperty(console, 'error', {
  writable: true,
  value: jest.fn()
});

// Mock para bootstrap
Object.defineProperty(window, 'bootstrap', {
  writable: true,
  value: {
    Modal: {
      getOrCreateInstance: jest.fn().mockReturnValue({
        show: jest.fn(),
        hide: jest.fn()
      })
    }
  }
});

// Mock para localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock para sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Configurar Angular testing
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);