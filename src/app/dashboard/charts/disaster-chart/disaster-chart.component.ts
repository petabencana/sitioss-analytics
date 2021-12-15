import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as Chart from 'chart.js';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';

import { TimeService } from '../../../services/time.service';
import * as styles from '../../../../styles.scss';

@Component({
  selector: 'app-disaster-chart',
  templateUrl: './disaster-chart.component.html',
  styleUrls: ['./disaster-chart.component.scss']
})
export class DisasterChartComponent implements OnInit, OnChanges {
  disasterChart: Chart;
  @Input() scaleLimits: {max: number, min: number};
  @Input() disastersData: {key: string, data:[{t: string, y: number}]}[];
  
  flood: {t: string, y: number};
  haze: {t: string, y: number};
  wind: {t: string, y: number};
  earthquake: {t: string, y: number};
  fire: {t: string, y: number};
  volcano: {t: string, y: number};

  constructor(
    private translate: TranslateService,
    private timeService: TimeService
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
    for (let j in this.disastersData) {
      for (let i in this.disastersData[j]) {
        if (this.disastersData[j][i].key == 'flood') {
          this.flood = this.disastersData[j][i].data;
        }
        if (this.disastersData[j][i].key == 'wind') {
          this.wind = this.disastersData[j][i].data;
        }
        if (this.disastersData[j][i].key == 'haze') {
          this.haze = this.disastersData[j][i].data;
        }
        if (this.disastersData[j][i].key == 'earthquake') {
          this.earthquake = this.disastersData[j][i].data;
        }
        if (this.disastersData[j][i].key == 'fire') {
          this.fire = this.disastersData[j][i].data;
        }
        if (this.disastersData[j][i].key == 'volcano') {
          this.volcano = this.disastersData[j][i].data;
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
            borderColor: styles["colors-flood"],
            pointRadius: 2,
            data: this.flood
          },
          {
            label: this.translate.get('legend.haze')['value'],
            xAxisId: 'x1',
            yAxisId: 'y1',
            borderWidth: 2,
            borderColor: styles["colors-haze"],
            pointRadius: 2,
            data: this.haze
          },
          {
            label: this.translate.get('legend.earthquake')['value'],
            xAxisId: 'x1',
            yAxisId: 'y1',
            borderWidth: 2,
            borderColor: styles["colors-earthquake"],
            pointRadius: 2,
            data: this.earthquake
          },
          {
            label: this.translate.get('legend.wind')['value'],
            xAxisId: 'x1',
            yAxisId: 'y1',
            borderWidth: 2,
            borderColor: styles["colors-wind"],
            pointRadius: 2,
            data: this.wind
          },
          {
            label: this.translate.get('legend.volcano')['value'],
            xAxisId: 'x1',
            yAxisId: 'y1',
            borderWidth: 2,
            borderColor: styles["colors-volcano"],
            pointRadius: 2,
            data: this.volcano
          },
          {
            label: this.translate.get('legend.fire')['value'],
            xAxisId: 'x1',
            yAxisId: 'y1',
            borderWidth: 2,
            borderColor: styles["colors-fire"],
            pointRadius: 2,
            data: this.fire
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
              tension: 0.2
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

        this.disasterChart.update();
      }
    }
  }
}
