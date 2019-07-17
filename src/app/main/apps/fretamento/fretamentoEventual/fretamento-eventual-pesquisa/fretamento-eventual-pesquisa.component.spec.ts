import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FretamentoEventualPesquisaComponent } from './fretamento-eventual-pesquisa.component';

describe('FretamentoEventualPesquisaComponent', () => {
  let component: FretamentoEventualPesquisaComponent;
  let fixture: ComponentFixture<FretamentoEventualPesquisaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FretamentoEventualPesquisaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FretamentoEventualPesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
