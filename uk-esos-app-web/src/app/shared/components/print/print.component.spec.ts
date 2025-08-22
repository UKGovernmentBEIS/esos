import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintComponent } from './print.component';

describe('PrintComponent', () => {
  let component: PrintComponent;
  let fixture: ComponentFixture<PrintComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let renderer2: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrintComponent],
      providers: [Renderer2],
    });

    fixture = TestBed.createComponent(PrintComponent);
    component = fixture.componentInstance;
    renderer2 = TestBed.inject(Renderer2);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable print styles', () => {
    const appendChildSpy = jest.spyOn(document.head, 'appendChild');

    component.enablePrintStyles();

    expect(appendChildSpy).toHaveBeenCalled();
    const appendedElement = appendChildSpy.mock.calls[0][0];
    expect(appendedElement.textContent).toContain('@media print');

    appendChildSpy.mockRestore();
  });

  it('should print content', () => {
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const setStyleSpy = jest.spyOn(component['renderer'], 'setStyle');
    const printSpy = jest.spyOn(window, 'print').mockImplementation();

    const mockPrintableContentWrapper = document.createElement('div');
    mockPrintableContentWrapper.className = 'printable-content-wrapper';
    jest.spyOn(component['el'].nativeElement, 'querySelector').mockReturnValue(mockPrintableContentWrapper);

    component.printContent();

    expect(appendChildSpy).toHaveBeenCalled();

    const clonedElement = appendChildSpy.mock.calls[0][0] as HTMLElement;
    expect(clonedElement).not.toBe(mockPrintableContentWrapper);
    expect(clonedElement.style.display).toBe('block');
    expect(setStyleSpy).toHaveBeenCalledWith(clonedElement, 'display', 'block');

    expect(printSpy).toHaveBeenCalled();

    appendChildSpy.mockRestore();
    setStyleSpy.mockRestore();
    printSpy.mockRestore();
  });
});
