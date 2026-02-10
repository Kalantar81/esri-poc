# ESRI Map Component Structure - esri-poc

## Overview

The map components have been split into a modular two-component architecture for better separation of concerns and reusability.

```
maps/
├── map/ (Parent container)
│   ├── map.component.ts
│   ├── map.component.html
│   ├── map.component.scss
│   ├── esri-map/ (Map view only)
│   │   ├── esri-map.component.ts
│   │   ├── esri-map.component.html
│   │   └── esri-map.component.scss
│   └── control-panel/ (Controls only)
│       ├── control-panel.component.ts
│       ├── control-panel.component.html
│       └── control-panel.component.scss
├── maps.ts
├── maps.html
└── maps.scss
```

## Component Breakdown

### 1. **MapComponent** (Parent Container)
**File:** `/map/map.component.ts`

**Responsibility:** Orchestrates communication between esri-map and control-panel components.

**Key Properties:**
- `selectedBasemap` - Current basemap selection
- `selectedSymbolType` - Current symbol style
- `entitiesAmount` - Number of entities per layer
- `isLoading` - Loading state
- `totalLoadingTime` - Last operation's loading time
- `lastLoadedTime` - Timestamp of last action
- `activeLayerIds` - Set of active layers
- `layerTypes` - Array of all available layers (22 types)

**Methods:**
- `onBasemapChanged()` - Updates basemap from control panel
- `onSymbolTypeChanged()` - Updates symbol type
- `onEntitiesAmountChanged()` - Updates entity count
- `onLayersChanged()` - Receives active layers from map
- `onLoadingTimeChanged()` - Receives loading metrics
- `onSettingsApplied()` - Applies all settings at once
- `initializeLayerTypes()` - Initializes the 22 layer definitions

**Layout:**
```
┌────────────────────────────────────┐
│  Map Component (Parent)             │
├──────────────────┬─────────────────┤
│  esri-map (70%)  │ control-panel   │
│                  │      (30%)      │
│                  │                 │
│                  │                 │
└──────────────────┴─────────────────┘
```

---

### 2. **EsriMapComponent** (Map View)
**File:** `/map/esri-map/esri-map.component.ts`

**Responsibility:** Handles ArcGIS map initialization, layer rendering, and map interactions.

**Inputs:**
- `@Input() selectedBasemap` - Basemap to display
- `@Input() selectedSymbolType` - Symbol style for layers
- `@Input() entitiesAmount` - Entities per layer
- `@Input() isLoading` - Loading state flag

**Outputs:**
- `@Output() layersChanged` - Emits active layer IDs when layers change
- `@Output() loadingTimeChanged` - Emits loading time metrics

**Key Properties:**
- `view` - Esri MapView instance
- `map` - Esri Map instance
- `activeLayers` - Map<string, any> storing active layers
- `activeLayerIds` - Set<string> tracking active IDs
- `ISRAEL_BOUNDS` - Geographic boundaries for coordinate transformation
- `LAYER_COLORS` - Color palette for 22 layers
- `layerTypes` - Array of layer configurations

**Core Methods:**

#### Layer Management
- `initializeMap()` - Initializes ArcGIS map and view
- `loadAllVisibleLayers()` - Loads all 22 layers in parallel
- `addLayer(layerId)` - Adds single layer with mock data
- `toggleLayer(layerId)` - Toggles layer visibility
- `reloadLayersWithNewSymbol()` - Reloads active layers with new symbol style

#### Data Processing
- `createMockLayerData()` - Generates demo geospatial data
- `filterDataByAmount()` - Filters features by entity count
- `transformDataToIsrael()` - Maps global coordinates to Israel bounds
- `transformToIsrael()` - Single coordinate transformation

#### Layer Building (Private)
- `buildGeoJSONLayer()` - Creates GeoJSON layer
- `buildGraphicsLayer()` - Creates Graphics layer
- `buildFeatureLayer()` - Creates Feature layer
- `buildCSVLayer()` - Creates CSV layer
- `buildFeatureCollectionLayer()` - Creates Feature Collection
- `buildClientSideFeatureLayer()` - Creates Client-Side Feature layer

#### Styling & Symbols
- `getSymbolForType()` - Returns Esri symbol object
- `getColorForLayer()` - Returns color for layer ID
- `generateComplexSVG()` - Creates dynamic SVG markers
- `getLayerColorStyle()` - Returns CSS rgba color

**Utility Methods:**
- `loadArcGISModules()` - Dynamically loads Esri modules via require.js
- `isLayerActive()` - Checks if layer is currently active

---

### 3. **ControlPanelComponent** (Controls)
**File:** `/map/control-panel/control-panel.component.ts`

**Responsibility:** Provides UI controls for map configuration and displays statistics.

**Inputs:**
- `@Input() layerTypes` - Array of layer definitions
- `@Input() activeLayerIds` - Set of currently active layers
- `@Input() isLoading` - Loading state
- `@Input() totalLoadingTime` - Last operation load time
- `@Input() lastLoadedTime` - Timestamp of last action

**Outputs:**
- `@Output() basemapChanged` - Emits basemap selection
- `@Output() symbolTypeChanged` - Emits symbol type
- `@Output() entitiesAmountChanged` - Emits entity amount
- `@Output() layerToggled` - Emits toggled layer ID
- `@Output() settingsApplied` - Emits all settings together

**Key Properties:**
- `selectedBasemap` - Current basemap
- `selectedSymbolType` - Current symbol type
- `entitiesAmount` - Entities per layer
- `isLayerPanelOpen` - Layer selector visibility
- `isHistoryExpanded` - History section visibility
- `history` - Array of past operations (max 20)
- `basemapOptions` - Array of 13 basemap options

**Key Methods:**
- `toggleLayerPanel()` - Show/hide layer selector
- `toggleHistory()` - Expand/collapse history
- `clearHistory()` - Clear history records
- `isLayerActive()` - Check if layer is active
- `getLayerColorStyle()` - Get CSS color for layer
- `onSettingsChange()` - Log settings changes
- `applySettings()` - Apply all settings and record to history
- `onLayerToggle()` - Handle layer toggle events
- `getTotalEntities()` - Calculate max possible entities
- `getActiveEntitiesCount()` - Calculate current loaded entities
- `getSymbolTypeName()` - Get display name for symbol type
- `getBasemapName()` - Get display name for basemap
- `addToHistory()` - Record operation to history

---

## Layer Types (22 Total)

Each layer combines:
- A unique **ID** and **name**
- A **type** (geojson, graphics, feature, csv, feature-collection, client-side)
- A **unique color** from the 22-color palette
- Mock data generation for demo purposes

### Layer IDs:
```
geojson, graphics, feature, csv, feature-collection, client-side,
geojson-2, graphics-2, feature-2, csv-2, collection-2, client-side-2,
geojson-3, graphics-3, feature-3, csv-3, collection-3, client-side-3,
geojson-4, graphics-4, feature-4, csv-4
```

---

## Communication Flow

```
MapComponent (Parent)
├─ Receives outputs from both child components
├─ Updates internal state
└─ Passes state as inputs to children

  ↓ (70% width)
  
EsriMapComponent
├─ Input: selectedBasemap, symbolType, entitiesAmount, isLoading
├─ Logic: Initialize map, manage layers, handle transformations
└─ Output: layersChanged, loadingTimeChanged
  
  ↑↓ (Via parent)
  
ControlPanelComponent
├─ Input: layerTypes, activeLayerIds, loading time, etc.
├─ Logic: Settings UI, layer selector, history tracking
└─ Output: basemapChanged, symbolTypeChanged, settingsApplied, etc.
```

---

## Key Features

### 1. Layer Management
- **22 distinct layers** with different types
- **Toggle on/off** individually
- **Parallel loading** for performance
- **Color-coded** in UI and on map

### 2. Basemap Support
13 basemap options from Esri:
- Streets, Satellite, Hybrid, Topographic
- Gray Canvas, Dark Gray Canvas, Oceans
- National Geographic, Terrain, OpenStreetMap
- Streets Night, Streets Navigation, Streets Relief

### 3. Symbol Customization
9 symbol types:
- Simple Marker, Circle, Square, Diamond
- Cross, X Symbol, Triangle
- Picture Marker (SVG), Complex SVG

### 4. Data Transformation
- **Coordinate Transformation:** Maps global coordinates to Israel boundaries
- **Data Filtering:** Limits features by entity count (100-100,000 per layer)
- **Mock Data Generation:** Creates realistic demo data

### 5. Statistics Tracking
- Active layer count (0-22)
- Total entities count
- Current symbol type
- Loading time (ms)
- Last action timestamp

### 6. History Tracking
- Records each settings application
- Stores: timestamp, basemap, symbol type, entities, load time, layer count
- Maximum 20 entries
- Expandable history table

---

## Styling

### Layout
- **Parent:** 70% map, 30% controls on desktop
- **Mobile:** Stacked vertically (60% map, 40% controls)
- **Color Scheme:** Esri blue (#0079c1), light gray backgrounds

### Interactive Elements
- Smooth transitions (0.2s - 0.3s)
- Hover effects on all controls
- Loading spinner animation
- Expandable panels with smooth transitions
- Color-coded layer indicators

---

## Data Flow Example

### Adding a Layer

1. **User clicks checkbox** in control panel
2. **ControlPanelComponent** emits `layerToggled` with layer ID
3. **MapComponent** receives event
4. **EsriMapComponent** receives via input (or parent calls method)
5. **EsriMapComponent**:
   - Finds layer configuration
   - Creates mock data
   - Filters by entity amount
   - Transforms coordinates to Israel
   - Creates appropriate layer type
   - Adds to map and internal maps
6. **EsriMapComponent** emits `layersChanged`
7. **MapComponent** updates `activeLayerIds`
8. **ControlPanelComponent** reflects new state via input

---

## Installation & Usage

### 1. Import into your module/standalone component:
```typescript
import { MapComponent } from './pages/maps/map/map.component';

@Component({
  selector: 'app-root',
  imports: [MapComponent],
  standalone: true
})
export class AppComponent {}
```

### 2. Use in template:
```html
<app-map></app-map>
```

---

## Requirements

- **Angular 17+** (Standalone components)
- **Esri ArcGIS JS API 4.x** (loaded via CDN)
- **FormsModule** (for two-way binding with ngModel)
- **CommonModule** (for structural directives)

---

## File Structure Summary

```
esri-poc/src/app/pages/maps/
├── map/
│   ├── esri-map/
│   │   ├── esri-map.component.ts (506 lines)
│   │   ├── esri-map.component.html
│   │   └── esri-map.component.scss
│   ├── control-panel/
│   │   ├── control-panel.component.ts (166 lines)
│   │   ├── control-panel.component.html
│   │   └── control-panel.component.scss
│   ├── map.component.ts (116 lines)
│   ├── map.component.html
│   └── map.component.scss
├── maps.ts (9 lines)
├── maps.html
└── maps.scss
```

---

## Notes

- **Mock Data:** Currently generates random geospatial data for demonstration
- **Coordinate Transformation:** All features are transformed to Israel boundaries for display
- **Performance:** Uses `Promise.all()` for parallel layer loading
- **Memory Management:** Properly destroys map view on component destroy
- **Responsive:** Adapts layout for mobile and tablet devices

---

## Future Enhancements

- Connect to real data sources (APIs)
- Add layer filtering/search
- Implement layer styling editor
- Add map drawing tools
- Export functionality
- Print support
- Advanced filtering options
- Custom layer creation
