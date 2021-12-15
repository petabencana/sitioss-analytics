import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import * as Chart from 'chart.js';
import * as mapboxgl from 'mapbox-gl';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from '../../services/http.service';
import { TableService } from '../../services/table.service';
import { TimeService } from '../../services/time.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  @Input() reportsSource: {aggregates: number[], labels: string[]} = {
    aggregates: [],
    labels: []
  };
  chartTypes: {
    id: string,
    class: string,
    center: Array<Number>,
    zoom: number
  }[];
  @Input() map: mapboxgl.Map;

  @Output() updateStats = new EventEmitter();
  @Output() scaleLimits: {max: number, min: number};
  @Output() reportsData: {t: string, y: number}[] = [];
  @Output() floodsData: {t: string, y: number}[] = [];
  @Output() jakartaData: {t: string, y: number}[] = [];
  constructor(
    private httpService: HttpService,
    private translate: TranslateService,
    private tableService: TableService,
    private timeservice: TimeService
  ) {
    this.chartTypes = [
      {id: 'activity', class: 'tabButton selected', center: [120, -2], zoom: 4.5},
      {id: 'source', class: 'tabButton', center: [120, -2], zoom: 4.5},
      {id: 'jakarta', class: 'tabButton', center: [106.86, -6.17], zoom: 11}
    ];
  }

  ngOnInit() {
    for (const type of this.chartTypes) {
      if (type.class.indexOf('selected', 10) === 10) {
        this.tableService.selectedChart = type.id;
      }
    }
  }

  changeCenter(coords, zoom) {
    if (this.map) {
      this.map.setCenter(coords);
      this.map.setMinZoom(zoom);
      this.map.setZoom(zoom);
    }
  }

  changeChart(e) {
    $('.tabButton').removeClass('selected');
    $('#' + e.target.id).addClass('selected');
    this.tableService.selectedChart = e.target.id.substring(0, e.target.id.length - 6);

    // Use jQuery to show / hide, using *ngIf destroys component, & thus current graphics
    $('.charts:not(#' + this.tableService.selectedChart + 'Wrapper)').hide();
    $('#' + this.tableService.selectedChart + 'Wrapper').show();

    const region = this.tableService.selectedChart == 'jakarta' ? 'ID-JK' : '';
    this.updateStats.emit(region);
  }

  async loadData(data, timeseries) {
    let response = await(timeseries)

    for (const report of response) {
      data.push({
        t: report.ts,
        y: report.count
      });
    }
  }

  prepareActivityData(timePeriod) {
    this.reportsData = [];
    this.floodsData = [];
    this.jakartaData = [];

    this.loadData(this.reportsData, this.httpService.getTimeseries('reports', timePeriod))
    .catch(error => console.log(error));
    this.loadData(this.floodsData, this.httpService.getTimeseries('floods', timePeriod))
    .catch(error => console.log(error));
    this.httpService.getReportsArchive(this.timeservice.selectedDateRange, timePeriod)
    .then(geojsonData => {
      const dataTS = this.timeservice.dataAnalysis
      for (let i = 0; i < dataTS.length-1; i++) {
        for (const data of geojsonData.features) {
          if (data.properties.created_at >= dataTS[i].ts && data.properties.created_at < dataTS[(i+1)%dataTS.length].ts) {
            dataTS[i].count += 1
          }
        }
      }
    })
    .catch(error => console.log(error));
  }

  // called on initialization
  drawChart(timePeriod) {
    this.prepareActivityData(timePeriod);
  }

  // called on dateChange
  updateChart(timePeriod) {
    this.scaleLimits = null;
    this.prepareActivityData(timePeriod);
  }

  // called on sliderChange
  updateScale(range) {
    this.scaleLimits = {
      max: range.lower.timestamp,
      min: range.upper.timestamp
    };
  }
}
