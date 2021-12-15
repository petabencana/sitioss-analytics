import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as Chart from 'chart.js';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { TimeService } from '../../../services/time.service';
import settings from '../settings'

@Component({
  selector: 'app-activity-chart',
  templateUrl: './activity-chart.component.html',
  styleUrls: ['./activity-chart.component.scss']
})
export class ActivityChartComponent implements OnInit, OnChanges {
  activityChart: Chart;
  @Input() reportsData: {t: string, y: number}[];
  @Input() floodsData: {t: string, y: number}[];
  @Input() scaleLimits: {max: number, min: number};

  constructor(
    private timeService: TimeService,
    private translate: TranslateService
  ) { }

  prepareCanvas() {
    $('#activityCanvasWrapper').empty();
    $('#activityCanvasWrapper').html(
      '<canvas id="activityInset"></canvas>'
    );

    const chart_ctx = $('#activityInset').get(0)['getContext']('2d');
    chart_ctx.canvas.width = $('#activityCanvasWrapper').width();
    chart_ctx.canvas.height = $('#activityCanvasWrapper').height();

    return chart_ctx;
  }

  ngOnInit() {
    const context = this.prepareCanvas();

    const chartSettings = {
      type: 'line',
      data: {
        datasets: [
          {
            label: this.translate.get('chart_legend.count')['value'],
            xAxisId: 'x1',
            yAxisId: 'y1',
            borderWidth: settings.border.width,
            borderColor: settings.border.color,
            backgroundColor: settings.backgroundColor.blue,
            pointRadius: settings.border.pointRadius,
            data: this.reportsData
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            fontColor: settings.font.color,
            fontFamily: settings.font.family
          }
        },
        scales: {
          yAxes: [{
            id: 'y1',
            type: 'linear',
            position: 'left',
            ticks: {
              fontColor: settings.font.color,
              fontFamily: settings.font.family
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
              fontColor: settings.font.color,
              fontFamily: settings.font.family
            }
          },
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
              fontColor: settings.font.color,
              fontFamily: settings.font.family
            }
          }
        ],
        }
      }
    };

    this.activityChart = new Chart(context, chartSettings);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('scaleLimits')) {
      if (changes.scaleLimits.currentValue && this.activityChart) {
        // Update time axis
        this.activityChart.options.scales.xAxes[0].time.min = this.scaleLimits.min;
        this.activityChart.options.scales.xAxes[0].time.max = this.scaleLimits.max;

        // Update date axis
        this.activityChart.options.scales.xAxes[1].time.min = this.scaleLimits.min;
        this.activityChart.options.scales.xAxes[1].time.max = this.scaleLimits.max;

        this.activityChart.update();
      }
    }
  }
}
