import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisasterChartComponent } from './disaster-chart.component';

describe('DisasterChartComponent', () => {
  let component: DisasterChartComponent;
  let fixture: ComponentFixture<DisasterChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisasterChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisasterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
