import { Component, OnInit } from '@angular/core';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, EsriMapComponent, ControlPanelComponent]
})
export class MapComponent implements OnInit {
  selectedBasemap: string = 'streets-vector';
  selectedSymbolType: string = 'simple-marker';
  entitiesAmount: number = 50000;
  isLoading: boolean = false;
  totalLoadingTime: number = 0;
  lastLoadedTime: string = '';
  activeLayerIds: Set<string> = new Set();
  
  layerTypes: any[] = [];

  ngOnInit(): void {
    this.initializeLayerTypes();
  }

  private initializeLayerTypes(): void {
    this.layerTypes = [
      {
        id: 'geojson',
        name: 'Earthquakes (GeoJSON)',
        description: 'GeoJSON Layer - USGS Earthquake Data',
        type: 'geojson',
        layerTypeName: 'GeoJSON Layer'
      },
      {
        id: 'graphics',
        name: 'ISS Location (Graphics)',
        description: 'Graphics Layer - International Space Station Real-time Position',
        type: 'graphics',
        layerTypeName: 'Graphics Layer'
      },
      {
        id: 'feature',
        name: 'World Countries (Feature)',
        description: 'Feature Layer - World Countries from REST Countries API',
        type: 'feature',
        layerTypeName: 'Feature Layer'
      },
      {
        id: 'csv',
        name: 'World Airports (CSV)',
        description: 'CSV Layer - Airports Data from OurAirports',
        type: 'csv',
        layerTypeName: 'CSV Layer'
      },
      {
        id: 'feature-collection',
        name: 'World Cities (Collection)',
        description: 'Feature Layer (Collection) - World Cities Database',
        type: 'feature-collection',
        layerTypeName: 'Feature Layer'
      },
      {
        id: 'client-side',
        name: 'Heritage Sites (Client-Side)',
        description: 'Feature Layer (Client-Side) - UNESCO World Heritage Sites',
        type: 'client-side',
        layerTypeName: 'Feature Layer'
      },
      {
        id: 'geojson-2',
        name: 'Volcanoes (GeoJSON)',
        description: 'GeoJSON Layer - Volcano Database',
        type: 'geojson',
        layerTypeName: 'GeoJSON Layer'
      },
      {
        id: 'graphics-2',
        name: 'ISS Path (Graphics)',
        description: 'Graphics Layer - ISS Orbital Path Visualization',
        type: 'graphics',
        layerTypeName: 'Graphics Layer'
      },
      {
        id: 'feature-2',
        name: 'Countries (Feature)',
        description: 'Feature Layer - Country Population Distribution',
        type: 'feature',
        layerTypeName: 'Feature Layer'
      },
      {
        id: 'csv-2',
        name: 'Major Airports (CSV)',
        description: 'CSV Layer - Major International Airports',
        type: 'csv',
        layerTypeName: 'CSV Layer'
      },
      {
        id: 'collection-2',
        name: 'Major Cities (Collection)',
        description: 'Feature Collection - Top 1000 World Cities by Population',
        type: 'feature-collection',
        layerTypeName: 'Feature Layer'
      },
      {
        id: 'client-side-2',
        name: 'Volcanoes (Client-Side)',
        description: 'Client-side Feature Layer - Active Volcanoes',
        type: 'client-side',
        layerTypeName: 'Feature Layer'
      },
      {
        id: 'geojson-3',
        name: 'Earthquakes Extended (GeoJSON)',
        description: 'GeoJSON Layer - Extended Earthquake Analysis',
        type: 'geojson',
        layerTypeName: 'GeoJSON Layer'
      },
      {
        id: 'graphics-3',
        name: 'Airports Visualization (Graphics)',
        description: 'Graphics Layer - Airport Distribution Heat Map',
        type: 'graphics',
        layerTypeName: 'Graphics Layer'
      },
      {
        id: 'feature-3',
        name: 'Global Population (Feature)',
        description: 'Feature Layer - Global Population Density Map',
        type: 'feature',
        layerTypeName: 'Feature Layer'
      },
      {
        id: 'csv-3',
        name: 'Cities Data (CSV)',
        description: 'CSV Layer - World Cities Detailed Information',
        type: 'csv',
        layerTypeName: 'CSV Layer'
      },
      {
        id: 'collection-3',
        name: 'Heritage Sites (Collection)',
        description: 'Feature Collection - UNESCO World Heritage Sites Network',
        type: 'feature-collection',
        layerTypeName: 'Feature Layer'
      },
      {
        id: 'client-side-3',
        name: 'Heritage Network (Client-Side)',
        description: 'Client-side Feature Layer - Heritage Sites Connection Map',
        type: 'client-side',
        layerTypeName: 'Feature Layer'
      },
      {
        id: 'geojson-4',
        name: 'Volcanoes Extended (GeoJSON)',
        description: 'GeoJSON Layer - Extended Volcano Analysis',
        type: 'geojson',
        layerTypeName: 'GeoJSON Layer'
      },
      {
        id: 'graphics-4',
        name: 'Countries Heat Map (Graphics)',
        description: 'Graphics Layer - Country Population Heat Map',
        type: 'graphics',
        layerTypeName: 'Graphics Layer'
      },
      {
        id: 'feature-4',
        name: 'Global Airports (Feature)',
        description: 'Feature Layer - Airport Network Analysis',
        type: 'feature',
        layerTypeName: 'Feature Layer'
      },
      {
        id: 'csv-4',
        name: 'World Data (CSV)',
        description: 'CSV Layer - Comprehensive World Data Integration',
        type: 'csv',
        layerTypeName: 'CSV Layer'
      }
    ];
  }

  onBasemapChanged(basemap: string): void {
    this.selectedBasemap = basemap;
  }

  onSymbolTypeChanged(symbolType: string): void {
    this.selectedSymbolType = symbolType;
  }

  onEntitiesAmountChanged(amount: number): void {
    this.entitiesAmount = amount;
  }

  onLayersChanged(activeLayerIds: Set<string>): void {
    this.activeLayerIds = activeLayerIds;
  }

  onLoadingTimeChanged(time: number): void {
    this.totalLoadingTime = time;
    this.lastLoadedTime = new Date().toLocaleTimeString();
  }

  onLayerToggled(layerId: string): void {
    // This will be handled by the map component
  }

  onSettingsApplied(settings: { basemap: string; symbolType: string; entitiesAmount: number }): void {
    this.selectedBasemap = settings.basemap;
    this.selectedSymbolType = settings.symbolType;
    this.entitiesAmount = settings.entitiesAmount;
  }
}
