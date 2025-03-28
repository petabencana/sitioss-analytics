import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import { TranslateService } from '@ngx-translate/core';
import { LayersService } from '../../services/layers.service';
import { HttpService } from '../../services/http.service';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [
    './map.component.scss'
  ]
})
export class MapComponent implements OnInit {
  @Output() floodAreas: object;
  @Output() map: mapboxgl.Map;
  @Output() finishedLoading = new EventEmitter();

  isShown: boolean;

  toggleShow() {
    this.isShown = ! this.isShown;
  }

  constructor(
    private layersService: LayersService,
    private translate: TranslateService,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    const self = this;
    mapboxgl.accessToken = 'pk.eyJ1IjoicGV0YWJlbmNhbmEiLCJhIjoiY2s2MjF1cnZmMDlxdzNscWc5MGVoMTRkeCJ9.PGcoQqU6lBrcLfBmvTrWrQ';
    self.map = new mapboxgl.Map({
      attributionControl: false,
      container: 'mapContainer',
      center: [120, -2],
      zoom: 4.5,
      style: 'mapbox://styles/mapbox/streets-v8',
      hash: false,
      preserveDrawingBuffer: true
    });
    // Add zoom and rotation controls to the map.
      self.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      const data = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        placeholder: this.translate.get('legend.search')['value'],
        mapboxgl: mapboxgl,
        countries: 'id', 
        bbox: [94.9106962020671,
                -11.1074231973731,
                141.029649999987,
                6.17575589605682],
        zoom: 11,
        marker: false,
        proximity: {
        longitude: -2,
        latitude: 120
        },
      });

    document.getElementById('geocoder').appendChild(data.onAdd(self.map));

    self.map.on('style.load', () => {
      
      // Load neighborhood polygons
      self.httpService.getFloodAreas(env.instance_region)
      .then(geojsonData => {
        self.floodAreas = geojsonData;
        self.layersService.loadFloodAreas(self.floodAreas, self.map)
        .then(() => {
          self.finishedLoading.emit();
        })
        .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
    });
  }
}
