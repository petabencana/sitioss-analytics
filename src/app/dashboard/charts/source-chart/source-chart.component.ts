import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import * as Chart from 'chart.js';
import * as $ from 'jquery';
import settings from '../settings'

@Component({
  selector: 'app-source-chart',
  templateUrl: './source-chart.component.html',
  styleUrls: ['./source-chart.component.scss']
})
export class SourceChartComponent implements OnInit, OnChanges {
  sourceChart: Chart;
  @Input() reportsSource: {aggregates: number[], labels: string[]};

  constructor() { }

  prepareCanvas() {
    $('#sourceCanvasWrapper').empty();
    $('#sourceCanvasWrapper').html(
      '<canvas id="sourceInset"></canvas>'
    );

    const chart_ctx = $('#sourceInset').get(0)['getContext']('2d');
    chart_ctx.canvas.width = $('#sourceCanvasWrapper').width();
    chart_ctx.canvas.height = $('#sourceCanvasWrapper').height();

    return chart_ctx;
  }

  ngOnInit() {
    const context = this.prepareCanvas();

    const chartSettings = {
      type: 'doughnut',
      data: {
        datasets: [{
          data: this.reportsSource.aggregates,
          borderWidth: [1, 1, 1],
          backgroundColor: [
            settings.backgroundColor.pink,
            settings.backgroundColor.blue,
            settings.backgroundColor.yellow
          ]
        }],
        labels: this.reportsSource.labels,
      },
      options: {
        legend: {
          display: true,
          position: 'left',
          labels: {
            fontColor: settings.font.color,
            fontFamily: settings.font.family
          }
        }
      }
    };

    this.sourceChart = new Chart(context, chartSettings);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('reportsSource')
    && changes.reportsSource.previousValue) {
      this.sourceChart.data.datasets[0].data = this.reportsSource.aggregates;
      this.sourceChart.update();
    }
  }
}
