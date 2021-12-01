import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as Chart from 'chart.js';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';

import { TimeService } from '../../../services/time.service';

@Component({
  selector: 'app-disaster-chart',
  templateUrl: './disaster-chart.component.html',
  styleUrls: ['./disaster-chart.component.scss']
})
export class DisasterChartComponent implements OnInit, OnChanges {
  disasterChart: Chart;
  @Input() scaleLimits: {max: number, min: number};
  @Input() disastersData: {key: string, data:[{t: string, y: number}]}[] = [];

  constructor(
    private translate: TranslateService,
    private timeService: TimeService,
    // private translate: TranslateService
  ) { }

  prepareCanvas() {
    $('#disasterCanvasWrapper').empty();
    $('#disasterCanvasWrapper').html(
      '<canvas id="disasterInset"></canvas>'
    );

    const chart_ctx = $('#disasterInset').get(0)['getContext']('2d');
    chart_ctx.canvas.width = $('#disasterCanvasWrapper').width();
    chart_ctx.canvas.height = $('#disasterCanvasWrapper').height();

    return chart_ctx;
  }

  ngOnInit() {
    for (var j in this.disastersData) {
      for (var i in this.disastersData[j]) {
        if (this.disastersData[j][i].key == 'flood') {
          var flood = this.disastersData[j][i].data;
        }
        if (this.disastersData[j][i].key == 'wind') {
          var wind = this.disastersData[j][i].data;
        }
        if (this.disastersData[j][i].key == 'haze') {
          var haze = this.disastersData[j][i].data;
        }
        if (this.disastersData[j][i].key == 'earthquake') {
          var earthquake = this.disastersData[j][i].data;
        }
        if (this.disastersData[j][i].key == 'fire') {
          var fire = this.disastersData[j][i].data;
        }
        if (this.disastersData[j][i].key == 'volcano') {
          var volcano = this.disastersData[j][i].data;
        }
      }
    } 

    const context = this.prepareCanvas();
    const chartSettings = {
      type: 'line',
      data: { 
        datasets: [
          {
            label: this.translate.get('legend.flood')['value'],
            xAxisId: 'x1',
            yAxisId: 'y1',
            borderWidth: 2,
            borderColor: '#31aade',
            pointRadius: 2,
            data: flood
          },
          {
            label: this.translate.get('legend.haze')['value'],
            xAxisId: 'x1',
            yAxisId: 'y1',
            borderWidth: 2,
            borderColor: '#99bfb3',
            pointRadius: 2,
            data: haze
          },
          {
            label: this.translate.get('legend.earthquake')['value'],
            xAxisId: 'x1',
            yAxisId: 'y1',
            borderWidth: 2,
            borderColor: '#f2bf07',
            pointRadius: 2,
            data: earthquake
          },
          {
            label: this.translate.get('legend.wind')['value'],
            xAxisId: 'x1',
            yAxisId: 'y1',
            borderWidth: 2,
            borderColor: '#d3ede5',
            pointRadius: 2,
            data: wind
          },
          {
            label: this.translate.get('legend.volcano')['value'],
            xAxisId: 'x1',
            yAxisId: 'y1',
            borderWidth: 2,
            borderColor: '#a10202',
            pointRadius: 2,
            data: volcano
          },
          {
            label: this.translate.get('legend.fire')['value'],
            xAxisId: 'x1',
            yAxisId: 'y1',
            borderWidth: 2,
            borderColor: '#f23a07',
            pointRadius: 2,
            data: fire
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false
        },
        elements: {
          line: {
              tension: 0.2, // disables bezier curves
          }
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            fontColor: '#d0d0d0',
            fontFamily: '"Roboto-Medium", "Roboto", "Open Sans"'
          }
        },
        scales: {
          yAxes: [{
            id: 'y1',
            type: 'linear',
            position: 'left',
            ticks: {
              fontColor: '#d0d0d0',
              fontFamily: '"Roboto-Medium", "Roboto", "Open Sans"',
              beginAtZero: true
            }
          }],
          xAxes: [{
            id: 'x1',
            type: 'time',
            time: {
              unit: 'hour',
              unitStepSize: 1,
              displayFormats: {
                hour: 'HH:mm'
              },
              parser: (time) => {
                return this.timeService.adjustTimezone(time);
              }
            },
            position: 'bottom',
            ticks: {
              autoSkip: true,
              autoSkipPadding: 12,
              fontColor: '#d0d0d0',
              fontFamily: '"Roboto Light", "Roboto", "Open Sans"'
            }
          }
          ,
          {
            id: 'x2',
            type: 'time',
            time: {
              unit: 'day',
              unitStepSize: 1,
              displayFormats: {
                day: 'MMM D'
              },
              parser: (time) => {
                return this.timeService.adjustTimezone(time);
              }
            },
            gridLines: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
            position: 'top',
            ticks: {
              autoSkip: true,
              autoSkipPadding: 12,
              fontColor: '#d0d0d0',
              fontFamily: '"Roboto Medium", "Roboto", "Open Sans"'
            }
          }
        ],
        }
      }
    };

    this.disasterChart = new Chart(context, chartSettings);        
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('scaleLimits')) {
      if (changes.scaleLimits.currentValue && this.disasterChart) {
        // Update time axis
        this.disasterChart.options.scales.xAxes[0].time.min = this.scaleLimits.min;
        this.disasterChart.options.scales.xAxes[0].time.max = this.scaleLimits.max;

        // Update date axis
        this.disasterChart.options.scales.xAxes[1].time.min = this.scaleLimits.min;
        this.disasterChart.options.scales.xAxes[1].time.max = this.scaleLimits.max;

        for (var j in this.disastersData) {
          for (var i in this.disastersData[j]) {
            if (this.disastersData[j][i].key == 'flood') {
              var flood = this.disastersData[j][i].data;
              this.disasterChart.data.datasets[0].data = flood;
            }
            if (this.disastersData[j][i].key == 'haze') {
              var haze = this.disastersData[j][i].data;
              this.disasterChart.data.datasets[1].data = haze;
            }
            if (this.disastersData[j][i].key == 'earthquake') {
              var earthquake = this.disastersData[j][i].data;
              this.disasterChart.data.datasets[2].data = earthquake;
            }
            if (this.disastersData[j][i].key == 'wind') {
              var wind = this.disastersData[j][i].data;
              this.disasterChart.data.datasets[3].data = wind;
            }
            if (this.disastersData[j][i].key == 'volcano') {
              var volcano = this.disastersData[j][i].data;
              this.disasterChart.data.datasets[4].data = volcano;
            }
            if (this.disastersData[j][i].key == 'fire') {
              var fire = this.disastersData[j][i].data;
              this.disasterChart.data.datasets[5].data = fire;
            }
          }
        } 

        this.disasterChart.update();
      }
    }
  }
}
