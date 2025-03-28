import { Component, Input, Output, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from '../../services/http.service';
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
    class: string
  }[];
  selectedChart: string;

  @Output() scaleLimits: {max: number, min: number};
  @Output() reportsData: {t: string, y: number}[] = [];
  @Output() floodsData: {t: string, y: number}[] = [];
  @Output() disastersData: {}[] = [];

  constructor(
    private httpService: HttpService,
    private translate: TranslateService,
    public timeService: TimeService
  ) {
    this.chartTypes = [
      {id: 'activity', class: 'tabButton selected'},
      {id: 'source', class: 'tabButton'},
      {id: 'disaster', class: 'tabButton'}
    ];
  }

  ngOnInit() {
    for (const type of this.chartTypes) {
      if (type.class.indexOf('selected', 10) === 10) {
        this.selectedChart = type.id;
      }
    }
  }

  changeChart(e) {
    $('.tabButton').removeClass('selected');
    $('#' + e.target.id).addClass('selected');
    this.selectedChart = e.target.id.substring(0, e.target.id.length - 6);

    // Use jQuery to show / hide, using *ngIf destroys component, & thus current graphics
    $('.charts:not(#' + this.selectedChart + 'Wrapper)').hide();
    $('#' + this.selectedChart + 'Wrapper').show();
  }

  prepareActivityData(timePeriod) {
    this.reportsData = [];
    this.floodsData = [];
    this.httpService.getTimeseries('reports', timePeriod)
    .then(reports => {
      this.httpService.getTimeseries('floods', timePeriod)
      .then(floods => {
        for (const report of reports) {
          this.reportsData.push({
            t: report.ts,
            y: report.count
          });
        }

        for (const area of floods) {
          this.floodsData.push({
            t: area.ts,
            y: area.count
          });
        }
      })
      .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
  }

  //make data chart by disaster_type
  prepareDisasterData(timePeriod) {
  this.httpService.getReportsArchive(timePeriod)
  .then(data => {
    const map = {}; 
    data.features.forEach(function(val){
      const disaster_type = val.properties.disaster_type;
      const disaster_time = val.properties.created_at.slice(0, 13) + ':00:00.00Z';

      map[disaster_type] = map[disaster_type] || {};
      map[disaster_type][disaster_time] = map[disaster_type][disaster_time] || 0;
      map[disaster_type][disaster_time]++;
    });
   
    const output = Object.keys(map).map(function(key){
      const matchData = [];
        
        for(let time in map[key]) {
          matchData.push( { t: time, y: map[key][time]} )
        }
        return {key, data: matchData};
      })
      
      this.disastersData = [];
      this.disastersData.push(output);
    })
  .catch(error => console.log(error));
  }

  // called on initialization
  drawChart(timePeriod) {
    this.prepareActivityData(timePeriod);
    this.prepareDisasterData(timePeriod);
  }

  // called on dateChange
  updateChart(timePeriod) {
    this.scaleLimits = null;
    this.prepareActivityData(timePeriod);
    this.prepareDisasterData(timePeriod);
  }

  // called on sliderChange
  updateScale(range) {
    this.scaleLimits = {
      max: range.lower.timestamp,
      min: range.upper.timestamp
    };
  }
}
