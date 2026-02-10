import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LayerType {
  id: string;
  name: string;
  description: string;
  type: 'feature' | 'graphics' | 'geojson' | 'csv' | 'feature-collection' | 'client-side';
  layerTypeName: string;
}

declare const require: any;

@Component({
  selector: 'app-esri-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.scss']
})
export class EsriMapComponent implements OnInit, OnDestroy {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  @Input() selectedBasemap: string = 'streets-vector';
  @Input() selectedSymbolType: string = 'simple-marker';
  @Input() entitiesAmount: number = 50000;
  @Input() isLoading: boolean = false;

  @Output() layersChanged = new EventEmitter<Set<string>>();
  @Output() loadingTimeChanged = new EventEmitter<number>();

  private view: any = null;
  private map: any = null;
  private activeLayers = new Map<string, any>();
  activeLayerIds: Set<string> = new Set();

  layersToLoad: number = 22;

  private readonly ISRAEL_BOUNDS = {
    minLat: 29.5,
    maxLat: 33.3,
    minLon: 34.2,
    maxLon: 35.9
  };

  private readonly LAYER_COLORS: { [key: string]: number[] } = {
    'geojson': [255, 69, 0, 0.8],
    'graphics': [0, 191, 255, 0.8],
    'feature': [50, 205, 50, 0.8],
    'csv': [255, 215, 0, 0.8],
    'collection-2': [138, 43, 226, 0.8],
    'client-side': [220, 20, 60, 0.8],
    'geojson-2': [255, 140, 0, 0.8],
    'graphics-2': [30, 144, 255, 0.8],
    'feature-2': [34, 139, 34, 0.8],
    'csv-2': [218, 165, 32, 0.8],
    'feature-collection': [147, 112, 219, 0.8],
    'client-side-2': [199, 21, 133, 0.8],
    'geojson-3': [255, 99, 71, 0.8],
    'graphics-3': [70, 130, 180, 0.8],
    'feature-3': [60, 179, 113, 0.8],
    'csv-3': [184, 134, 11, 0.8],
    'collection-3': [123, 104, 238, 0.8],
    'client-side-3': [186, 85, 211, 0.8],
    'geojson-4': [255, 127, 80, 0.8],
    'graphics-4': [95, 158, 160, 0.8],
    'feature-4': [46, 139, 87, 0.8],
    'csv-4': [205, 133, 63, 0.8]
  };

  // Cached ArcGIS module references
  private esriModules: any = {};

  layerTypes: LayerType[] = [
    { id: 'geojson', name: 'Earthquakes (GeoJSON)', description: 'GeoJSON Layer - USGS Earthquake Data', type: 'geojson', layerTypeName: 'GeoJSON Layer' },
    { id: 'graphics', name: 'ISS Location (Graphics)', description: 'Graphics Layer - International Space Station Real-time Position', type: 'graphics', layerTypeName: 'Graphics Layer' },
    { id: 'feature', name: 'World Countries (Feature)', description: 'Feature Layer - World Countries from REST Countries API', type: 'feature', layerTypeName: 'Feature Layer' },
    { id: 'csv', name: 'World Airports (CSV)', description: 'CSV Layer - Airports Data from OurAirports', type: 'csv', layerTypeName: 'CSV Layer' },
    { id: 'feature-collection', name: 'World Cities (Collection)', description: 'Feature Layer (Collection) - World Cities Database', type: 'feature-collection', layerTypeName: 'Feature Layer' },
    { id: 'client-side', name: 'Heritage Sites (Client-Side)', description: 'Feature Layer (Client-Side) - UNESCO World Heritage Sites', type: 'client-side', layerTypeName: 'Feature Layer' },
    { id: 'geojson-2', name: 'Volcanoes (GeoJSON)', description: 'GeoJSON Layer - Volcano Database', type: 'geojson', layerTypeName: 'GeoJSON Layer' },
    { id: 'graphics-2', name: 'ISS Path (Graphics)', description: 'Graphics Layer - ISS Orbital Path Visualization', type: 'graphics', layerTypeName: 'Graphics Layer' },
    { id: 'feature-2', name: 'Countries (Feature)', description: 'Feature Layer - Country Population Distribution', type: 'feature', layerTypeName: 'Feature Layer' },
    { id: 'csv-2', name: 'Major Airports (CSV)', description: 'CSV Layer - Major International Airports', type: 'csv', layerTypeName: 'CSV Layer' },
    { id: 'collection-2', name: 'Major Cities (Collection)', description: 'Feature Collection - Top 1000 World Cities by Population', type: 'feature-collection', layerTypeName: 'Feature Layer' },
    { id: 'client-side-2', name: 'Volcanoes (Client-Side)', description: 'Client-side Feature Layer - Active Volcanoes', type: 'client-side', layerTypeName: 'Feature Layer' },
    { id: 'geojson-3', name: 'Earthquakes Extended (GeoJSON)', description: 'GeoJSON Layer - Extended Earthquake Analysis', type: 'geojson', layerTypeName: 'GeoJSON Layer' },
    { id: 'graphics-3', name: 'Airports Visualization (Graphics)', description: 'Graphics Layer - Airport Distribution Heat Map', type: 'graphics', layerTypeName: 'Graphics Layer' },
    { id: 'feature-3', name: 'Global Population (Feature)', description: 'Feature Layer - Global Population Density Map', type: 'feature', layerTypeName: 'Feature Layer' },
    { id: 'csv-3', name: 'Cities Data (CSV)', description: 'CSV Layer - World Cities Detailed Information', type: 'csv', layerTypeName: 'CSV Layer' },
    { id: 'collection-3', name: 'Heritage Sites (Collection)', description: 'Feature Collection - UNESCO World Heritage Sites Network', type: 'feature-collection', layerTypeName: 'Feature Layer' },
    { id: 'client-side-3', name: 'Heritage Network (Client-Side)', description: 'Client-side Feature Layer - Heritage Sites Connection Map', type: 'client-side', layerTypeName: 'Feature Layer' },
    { id: 'geojson-4', name: 'Volcanoes Extended (GeoJSON)', description: 'GeoJSON Layer - Extended Volcano Analysis', type: 'geojson', layerTypeName: 'GeoJSON Layer' },
    { id: 'graphics-4', name: 'Countries Heat Map (Graphics)', description: 'Graphics Layer - Country Population Heat Map', type: 'graphics', layerTypeName: 'Graphics Layer' },
    { id: 'feature-4', name: 'Global Airports (Feature)', description: 'Feature Layer - Airport Network Analysis', type: 'feature', layerTypeName: 'Feature Layer' },
    { id: 'csv-4', name: 'World Data (CSV)', description: 'CSV Layer - Comprehensive World Data Integration', type: 'csv', layerTypeName: 'CSV Layer' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.initializeMap();
  }

  get visibleLayerTypes(): LayerType[] {
    return this.layerTypes;
  }

  private loadArcGISModules(modules: string[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      require(modules, (...args: any[]) => {
        resolve(args);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  private async initializeMap(): Promise<void> {
    try {
      const [Map, MapView, GeoJSONLayer, GraphicsLayer, FeatureLayer, CSVLayer, Graphic, Point] =
        await this.loadArcGISModules([
          'esri/Map',
          'esri/views/MapView',
          'esri/layers/GeoJSONLayer',
          'esri/layers/GraphicsLayer',
          'esri/layers/FeatureLayer',
          'esri/layers/CSVLayer',
          'esri/Graphic',
          'esri/geometry/Point'
        ]);

      this.esriModules = { Map, MapView, GeoJSONLayer, GraphicsLayer, FeatureLayer, CSVLayer, Graphic, Point };

      this.map = new Map({
        basemap: this.selectedBasemap
      });

      this.view = new MapView({
        container: this.mapViewEl.nativeElement,
        map: this.map,
        center: [35.0, 31.5],
        zoom: 7
      });

      await this.view.when();
      await this.loadAllVisibleLayers();

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private async loadAllVisibleLayers(): Promise<void> {
    const startTime = performance.now();

    try {
      console.log(`Starting to load ${this.visibleLayerTypes.length} layers...`);

      const layerPromises = this.visibleLayerTypes.map(layer =>
        this.addLayer(layer.id).catch(err => {
          console.error(`Failed to load layer ${layer.id}:`, err);
          return null;
        })
      );
      await Promise.all(layerPromises);

      const endTime = performance.now();
      const loadingTime = Math.round(endTime - startTime);
      this.loadingTimeChanged.emit(loadingTime);

      console.log(`Loaded ${this.activeLayerIds.size} of ${this.visibleLayerTypes.length} layers in ${loadingTime}ms`);

    } catch (error) {
      console.error('Error loading layers:', error);
    }
  }

  async toggleLayer(layerId: string): Promise<void> {
    if (this.isLoading) return;

    if (this.activeLayers.has(layerId)) {
      const layer = this.activeLayers.get(layerId);
      if (layer) {
        this.map.remove(layer);
        this.activeLayers.delete(layerId);
        this.activeLayerIds.delete(layerId);
      }
    } else {
      await this.addLayer(layerId);
    }

    this.layersChanged.emit(this.activeLayerIds);
  }

  isLayerActive(layerId: string): boolean {
    return this.activeLayerIds.has(layerId);
  }

  getLayerColorStyle(layerId: string): string {
    const color = this.getColorForLayer(layerId);
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
  }

  updateBasemap(basemap: string): void {
    if (this.map) {
      this.map.basemap = basemap;
    }
  }

  async reloadLayersWithNewSymbol(): Promise<void> {
    const activeLayerIds = Array.from(this.activeLayers.keys());

    activeLayerIds.forEach(layerId => {
      const layer = this.activeLayers.get(layerId);
      if (layer) {
        this.map.remove(layer);
      }
    });
    this.activeLayers.clear();
    this.activeLayerIds.clear();

    const layerPromises = activeLayerIds.map(layerId => this.addLayer(layerId));
    await Promise.all(layerPromises);

    this.layersChanged.emit(this.activeLayerIds);
  }

  private async addLayer(layerId: string): Promise<void> {
    const startTime = performance.now();

    try {
      const layerConfig = this.layerTypes.find(l => l.id === layerId);
      if (!layerConfig) {
        console.error('Layer configuration not found');
        return;
      }

      const mockData = this.createMockLayerData();
      const filteredData = this.filterDataByAmount(mockData, this.entitiesAmount);
      const transformedData = this.transformDataToIsrael(filteredData);

      let newLayer: any;
      switch (layerConfig.type) {
        case 'geojson':
          newLayer = this.buildGeoJSONLayer(transformedData, layerId);
          break;
        case 'graphics':
          newLayer = this.buildGraphicsLayer(transformedData, layerId);
          break;
        case 'feature':
          newLayer = this.buildFeatureLayer(transformedData, layerId);
          break;
        case 'csv':
          newLayer = this.buildCSVLayer(transformedData, layerId);
          break;
        case 'feature-collection':
          newLayer = this.buildFeatureCollectionLayer(transformedData, layerId);
          break;
        case 'client-side':
          newLayer = this.buildClientSideFeatureLayer(transformedData, layerId);
          break;
      }

      if (newLayer) {
        this.map.add(newLayer);
        this.activeLayers.set(layerId, newLayer);
        this.activeLayerIds.add(layerId);
      }

      const endTime = performance.now();
      console.log(`Added layer ${layerId} in ${Math.round(endTime - startTime)}ms`);

    } catch (error) {
      console.error('Error adding layer:', error);
    }
  }

  private createMockLayerData(): any {
    const features = [];
    const count = Math.min(this.entitiesAmount, 100);

    for (let i = 0; i < count; i++) {
      features.push({
        geometry: {
          coordinates: [Math.random() * 360 - 180, Math.random() * 180 - 90]
        },
        properties: {
          id: `feature-${i}`,
          latitude: Math.random() * 180 - 90,
          longitude: Math.random() * 360 - 180,
          mag: Math.random() * 8,
          magnitude_type: 'ml',
          place: `Location ${i}`,
          time: new Date().toISOString(),
          depth: Math.random() * 100,
          status: 'reviewed',
          felt_reports: Math.floor(Math.random() * 100),
          significant: 'false',
          tsunami: 'false',
          reported_by: 'USGS'
        }
      });
    }

    return { features };
  }

  private filterDataByAmount(data: any, amount: number): any {
    if (!data || !data.features) {
      return data;
    }
    return { ...data, features: data.features.slice(0, amount) };
  }

  private transformDataToIsrael(data: any): any {
    const transformedData = { ...data };
    if (transformedData.features) {
      transformedData.features = transformedData.features.map((feature: any) => {
        const [originalLon, originalLat] = feature.geometry.coordinates;
        const transformed = this.transformToIsrael(originalLon, originalLat);
        return {
          ...feature,
          geometry: { ...feature.geometry, coordinates: [transformed.lon, transformed.lat] }
        };
      });
    }
    return transformedData;
  }

  private transformToIsrael(lon: number, lat: number): { lon: number; lat: number } {
    const normalizedLon = (lon + 180) / 360;
    const normalizedLat = (lat + 90) / 180;
    const israelLon = this.ISRAEL_BOUNDS.minLon + (normalizedLon * (this.ISRAEL_BOUNDS.maxLon - this.ISRAEL_BOUNDS.minLon));
    const israelLat = this.ISRAEL_BOUNDS.minLat + (normalizedLat * (this.ISRAEL_BOUNDS.maxLat - this.ISRAEL_BOUNDS.minLat));
    return { lon: israelLon, lat: israelLat };
  }

  private getColorForLayer(layerId: string): number[] {
    return this.LAYER_COLORS[layerId] || [255, 69, 0, 0.8];
  }

  private generateComplexSVG(layerId: string): string {
    const color = this.getColorForLayer(layerId);
    const svgTypes = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 15,10 23,10 17,16 20,24 12,18 4,24 7,16 1,10 9,10" fill="rgb(${color[0]},${color[1]},${color[2]})" stroke="white" stroke-width="1"/></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgb(${color[0]},${color[1]},${color[2]})" stroke="white" stroke-width="1"/></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="rgb(${color[0]},${color[1]},${color[2]})" stroke="white" stroke-width="1"/></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 22,12 12,22 2,12" fill="rgb(${color[0]},${color[1]},${color[2]})" stroke="white" stroke-width="1"/></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 22,20 2,20" fill="rgb(${color[0]},${color[1]},${color[2]})" stroke="white" stroke-width="1"/></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="rgb(${color[0]},${color[1]},${color[2]})" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="white" stroke-width="1"/></svg>`
    ];
    const layerIndex = this.layerTypes.findIndex(l => l.id === layerId);
    const svgIndex = (layerIndex >= 0 ? layerIndex : 0) % svgTypes.length;
    return 'data:image/svg+xml;base64,' + btoa(svgTypes[svgIndex]);
  }

  private getSymbolForType(layerId: string): any {
    const color = this.getColorForLayer(layerId);

    const symbols: { [key: string]: any } = {
      'simple-marker': { type: 'simple-marker', style: 'circle', color, size: '8px', outline: { color: [255, 255, 255], width: 1 } },
      'circle': { type: 'simple-marker', style: 'circle', color, size: '10px', outline: { color: [255, 255, 255], width: 2 } },
      'square': { type: 'simple-marker', style: 'square', color, size: '10px', outline: { color: [255, 255, 255], width: 1 } },
      'diamond': { type: 'simple-marker', style: 'diamond', color, size: '12px', outline: { color: [255, 255, 255], width: 1 } },
      'cross': { type: 'simple-marker', style: 'cross', color, size: '12px', outline: { color: [255, 255, 255], width: 2 } },
      'x': { type: 'simple-marker', style: 'x', color, size: '12px', outline: { color: [255, 255, 255], width: 2 } },
      'triangle': { type: 'simple-marker', style: 'triangle', color, size: '12px', outline: { color: [255, 255, 255], width: 1 } },
      'picture-marker': {
        type: 'picture-marker',
        url: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="rgb(${color[0]},${color[1]},${color[2]})" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`),
        width: '20px', height: '20px'
      },
      'complex-svg': { type: 'picture-marker', url: this.generateComplexSVG(layerId), width: '20px', height: '20px' }
    };

    return symbols[this.selectedSymbolType] || symbols['simple-marker'];
  }

  private buildGeoJSONLayer(data: any, layerId: string): any {
    const { GeoJSONLayer } = this.esriModules;

    const geojson = {
      type: 'FeatureCollection',
      features: (data.features || []).map((f: any) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: f.geometry.coordinates },
        properties: f.properties
      }))
    };

    const blob = new Blob([JSON.stringify(geojson)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    return new GeoJSONLayer({
      url,
      renderer: { type: 'simple', symbol: this.getSymbolForType(layerId) },
      popupTemplate: { title: 'Location Info', content: '<b>ID:</b> {id}<br><b>Latitude:</b> {latitude}<br><b>Longitude:</b> {longitude}' }
    });
  }

  private buildGraphicsLayer(data: any, layerId: string): any {
    const { GraphicsLayer, Graphic, Point } = this.esriModules;
    const layer = new GraphicsLayer();
    const features = data.features || [];
    const symbol = this.getSymbolForType(layerId);

    features.forEach((feature: any) => {
      const [lon, lat] = feature.geometry.coordinates;
      layer.add(new Graphic({
        geometry: new Point({ longitude: lon, latitude: lat }),
        symbol,
        attributes: feature.properties,
        popupTemplate: { title: 'Location Info', content: '<b>ID:</b> {id}<br><b>Latitude:</b> {latitude}<br><b>Longitude:</b> {longitude}' }
      }));
    });

    return layer;
  }

  private buildFeatureLayer(data: any, layerId: string): any {
    const { FeatureLayer, Graphic, Point } = this.esriModules;
    const features = data.features || [];
    const graphics = features.map((feature: any) => {
      const [lon, lat] = feature.geometry.coordinates;
      return new Graphic({
        geometry: new Point({ longitude: lon, latitude: lat }),
        attributes: feature.properties
      });
    });

    return new FeatureLayer({
      source: graphics,
      objectIdField: 'OBJECTID',
      fields: [
        { name: 'OBJECTID', type: 'oid' },
        { name: 'id', type: 'string' },
        { name: 'latitude', type: 'double' },
        { name: 'longitude', type: 'double' }
      ],
      renderer: { type: 'simple', symbol: this.getSymbolForType(layerId) },
      popupTemplate: { title: 'Location Info', content: '<b>ID:</b> {id}<br><b>Latitude:</b> {latitude}<br><b>Longitude:</b> {longitude}' }
    });
  }

  private buildCSVLayer(data: any, layerId: string): any {
    const { CSVLayer } = this.esriModules;
    const features = data.features || [];
    let csvContent = 'longitude,latitude,id\n';

    features.forEach((feature: any) => {
      const [lon, lat] = feature.geometry.coordinates;
      csvContent += `${lon},${lat},"${feature.properties.id}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    return new CSVLayer({
      url,
      latitudeField: 'latitude',
      longitudeField: 'longitude',
      renderer: { type: 'simple', symbol: this.getSymbolForType(layerId) },
      popupTemplate: { title: 'Location Info', content: '<b>ID:</b> {id}' }
    });
  }

  private buildFeatureCollectionLayer(data: any, layerId: string): any {
    const { FeatureLayer, Graphic, Point } = this.esriModules;
    const features = data.features || [];
    const graphics = features.map((feature: any, index: number) => {
      const [lon, lat] = feature.geometry.coordinates;
      return new Graphic({
        geometry: new Point({ longitude: lon, latitude: lat }),
        attributes: { ObjectID: index, id: feature.properties.id, latitude: feature.properties.latitude, longitude: feature.properties.longitude }
      });
    });

    return new FeatureLayer({
      source: graphics,
      objectIdField: 'ObjectID',
      geometryType: 'point',
      fields: [
        { name: 'ObjectID', type: 'oid' },
        { name: 'id', type: 'string' },
        { name: 'latitude', type: 'double' },
        { name: 'longitude', type: 'double' }
      ],
      renderer: { type: 'simple', symbol: this.getSymbolForType(layerId) },
      popupTemplate: { title: 'Location Info', content: '<b>ID:</b> {id}<br><b>Latitude:</b> {latitude}<br><b>Longitude:</b> {longitude}' }
    });
  }

  private buildClientSideFeatureLayer(data: any, layerId: string): any {
    const { FeatureLayer, Graphic, Point } = this.esriModules;
    const features = data.features || [];
    const graphics = features.map((feature: any, index: number) => {
      const [lon, lat] = feature.geometry.coordinates;
      return new Graphic({
        geometry: new Point({ longitude: lon, latitude: lat, spatialReference: { wkid: 4326 } }),
        attributes: { OBJECTID: index, id: feature.properties.id, latitude: feature.properties.latitude, longitude: feature.properties.longitude }
      });
    });

    return new FeatureLayer({
      source: graphics,
      objectIdField: 'OBJECTID',
      geometryType: 'point',
      spatialReference: { wkid: 4326 },
      fields: [
        { name: 'OBJECTID', alias: 'OBJECTID', type: 'oid' },
        { name: 'id', alias: 'ID', type: 'string' },
        { name: 'latitude', alias: 'Latitude', type: 'double' },
        { name: 'longitude', alias: 'Longitude', type: 'double' }
      ],
      renderer: { type: 'simple', symbol: this.getSymbolForType(layerId) },
      popupTemplate: { title: 'Location Info', content: '<b>ID:</b> {id}<br><b>Latitude:</b> {latitude}<br><b>Longitude:</b> {longitude}' }
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      this.view.destroy();
    }
  }
}
