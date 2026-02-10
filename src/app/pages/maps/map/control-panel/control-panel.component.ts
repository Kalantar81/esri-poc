import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LayerType {
  id: string;
  name: string;
  description: string;
  type: 'feature' | 'graphics' | 'geojson' | 'csv' | 'feature-collection' | 'client-side';
  layerTypeName: string;
}

interface HistoryEntry {
  timestamp: Date;
  basemap: string;
  symbolType: string;
  totalEntities: number;
  loadingTime: number;
  activeLayersCount: number;
}

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
  @Input() layerTypes: LayerType[] = [];
  @Input() activeLayerIds: Set<string> = new Set();
  @Input() isLoading: boolean = false;
  @Input() totalLoadingTime: number = 0;
  @Input() lastLoadedTime: string = '';

  @Output() basemapChanged = new EventEmitter<string>();
  @Output() symbolTypeChanged = new EventEmitter<string>();
  @Output() entitiesAmountChanged = new EventEmitter<number>();
  @Output() layerToggled = new EventEmitter<string>();
  @Output() settingsApplied = new EventEmitter<{ basemap: string; symbolType: string; entitiesAmount: number }>();

  selectedBasemap: string = 'streets-vector';
  selectedSymbolType: string = 'simple-marker';
  entitiesAmount: number = 50000;
  isLayerPanelOpen: boolean = false;
  isHistoryExpanded: boolean = false;
  history: HistoryEntry[] = [];

  basemapOptions = [
    { id: 'streets-vector', name: 'Streets' },
    { id: 'satellite', name: 'Satellite' },
    { id: 'hybrid', name: 'Hybrid (Satellite + Labels)' },
    { id: 'topo-vector', name: 'Topographic' },
    { id: 'gray-vector', name: 'Gray Canvas' },
    { id: 'dark-gray-vector', name: 'Dark Gray Canvas' },
    { id: 'oceans', name: 'Oceans' },
    { id: 'national-geographic', name: 'National Geographic' },
    { id: 'terrain', name: 'Terrain' },
    { id: 'osm', name: 'OpenStreetMap' },
    { id: 'streets-night-vector', name: 'Streets (Night)' },
    { id: 'streets-navigation-vector', name: 'Streets (Navigation)' },
    { id: 'streets-relief-vector', name: 'Streets (Relief)' }
  ];

  ngOnInit(): void {
    // Initialize can add custom logic here
  }

  toggleLayerPanel(): void {
    this.isLayerPanelOpen = !this.isLayerPanelOpen;
  }

  toggleHistory(): void {
    this.isHistoryExpanded = !this.isHistoryExpanded;
  }

  clearHistory(): void {
    this.history = [];
  }

  isLayerActive(layerId: string): boolean {
    return this.activeLayerIds.has(layerId);
  }

  getLayerColorStyle(layerId: string): string {
    const colors: { [key: string]: string } = {
      'geojson': 'rgba(255, 69, 0, 0.8)',
      'graphics': 'rgba(0, 191, 255, 0.8)',
      'feature': 'rgba(50, 205, 50, 0.8)',
      'csv': 'rgba(255, 215, 0, 0.8)',
      'collection-2': 'rgba(138, 43, 226, 0.8)',
      'client-side': 'rgba(220, 20, 60, 0.8)',
      'geojson-2': 'rgba(255, 140, 0, 0.8)',
      'graphics-2': 'rgba(30, 144, 255, 0.8)',
      'feature-2': 'rgba(34, 139, 34, 0.8)',
      'csv-2': 'rgba(218, 165, 32, 0.8)',
      'feature-collection': 'rgba(147, 112, 219, 0.8)',
      'client-side-2': 'rgba(199, 21, 133, 0.8)',
      'geojson-3': 'rgba(255, 99, 71, 0.8)',
      'graphics-3': 'rgba(70, 130, 180, 0.8)',
      'feature-3': 'rgba(60, 179, 113, 0.8)',
      'csv-3': 'rgba(184, 134, 11, 0.8)',
      'collection-3': 'rgba(123, 104, 238, 0.8)',
      'client-side-3': 'rgba(186, 85, 211, 0.8)',
      'geojson-4': 'rgba(255, 127, 80, 0.8)',
      'graphics-4': 'rgba(95, 158, 160, 0.8)',
      'feature-4': 'rgba(46, 139, 87, 0.8)',
      'csv-4': 'rgba(205, 133, 63, 0.8)'
    };
    return colors[layerId] || 'rgba(255, 69, 0, 0.8)';
  }

  onSettingsChange(): void {
    console.log('Settings changed - Basemap:', this.selectedBasemap, 'Symbol:', this.selectedSymbolType, 'Amount:', this.entitiesAmount);
  }

  applySettings(): void {
    this.settingsApplied.emit({
      basemap: this.selectedBasemap,
      symbolType: this.selectedSymbolType,
      entitiesAmount: this.entitiesAmount
    });
    this.addToHistory();
  }

  onLayerToggle(layerId: string): void {
    this.layerToggled.emit(layerId);
  }

  getTotalEntities(): number {
    return this.entitiesAmount * (this.layerTypes.length || 22);
  }

  getActiveEntitiesCount(): number {
    return this.entitiesAmount * this.activeLayerIds.size;
  }

  getSymbolTypeName(): string {
    const symbolNames: { [key: string]: string } = {
      'simple-marker': 'Simple Point',
      'circle': 'Circle',
      'square': 'Square',
      'diamond': 'Diamond',
      'cross': 'Cross',
      'x': 'X Symbol',
      'triangle': 'Triangle',
      'picture-marker': 'SVG Icon',
      'complex-svg': 'Complex SVG'
    };
    return symbolNames[this.selectedSymbolType] || this.selectedSymbolType;
  }

  getBasemapName(id: string): string {
    const basemap = this.basemapOptions.find(b => b.id === id);
    return basemap ? basemap.name : id;
  }

  private addToHistory(): void {
    const entry: HistoryEntry = {
      timestamp: new Date(),
      basemap: this.getBasemapName(this.selectedBasemap),
      symbolType: this.getSymbolTypeName(),
      totalEntities: this.entitiesAmount,
      loadingTime: this.totalLoadingTime,
      activeLayersCount: this.activeLayerIds.size
    };

    this.history.unshift(entry);

    if (this.history.length > 20) {
      this.history = this.history.slice(0, 20);
    }
  }
}
