import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { ChartsComponent } from './charts/charts.component';
import { StatsComponent } from './stats/stats.component';
import { SliderComponent } from './slider/slider.component';
import { MapComponent } from './map/map.component';
import { RangeComponent } from './slider/range/range.component';
import { ActivityChartComponent } from './charts/activity-chart/activity-chart.component';
import { SourceChartComponent } from './charts/source-chart/source-chart.component';
import { LegendComponent } from './legend/legend.component';

import { CustomMaterialsModule } from '../custom-materials.module';

import { HttpService } from '../services/http.service';
import { LayersService } from '../services/layers.service';
import { TimeService } from '../services/time.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { DisasterChartComponent } from './charts/disaster-chart/disaster-chart.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomMaterialsModule,
    RouterModule,
    TranslateModule,
    MatToolbarModule,
    MatAutocompleteModule
  ],
  providers: [
    HttpService,
    LayersService,
    TimeService,
    TranslatePipe
  ],
  declarations: [
    DashboardComponent,
    ChartsComponent,
    StatsComponent,
    SliderComponent,
    MapComponent,
    RangeComponent,
    ActivityChartComponent,
    SourceChartComponent,
    LegendComponent,
    DisasterChartComponent
  ]
})

export class DashboardModule { }
