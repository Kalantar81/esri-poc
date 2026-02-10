# Styling Guide - ESRI POC Project

## Overview

This project uses a comprehensive styling system built on **SCSS** and **PrimeNG** components. The styling is organized in layers for maintainability, consistency, and scalability.

## File Structure

```
src/
├── styles.scss              # Global styles & CSS variables
├── styles/
│   ├── _variables.scss      # SCSS variables and mixins
│   └── _example-components.scss  # Example component patterns
└── app/
    └── app.scss             # App component styles
```

## Design System

### Color Palette

#### Primary Colors
- **Primary**: `#0078d4` (Microsoft Blue)
- **Primary Dark**: `#005a9e`
- **Primary Light**: `#50e6ff`

#### Semantic Colors
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)
- **Info**: `#3b82f6` (Blue)

#### Gray Scale
- **Gray 50 - 900**: Complete neutral color scale for versatile use

### Typography

#### Font Family
- **Primary**: System font stack (San Francisco, Segoe UI, etc.)
- **Monospace**: Fira Code, Courier New

#### Font Sizes
```
xs   = 0.75rem   (12px)
sm   = 0.875rem  (14px)
base = 1rem      (16px)
lg   = 1.125rem  (18px)
xl   = 1.25rem   (20px)
2xl  = 1.5rem    (24px)
3xl  = 1.875rem  (30px)
4xl  = 2.25rem   (36px)
```

#### Font Weights
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing Scale

```
0  = 0
1  = 0.25rem   (4px)
2  = 0.5rem    (8px)
3  = 0.75rem   (12px)
4  = 1rem      (16px)
5  = 1.25rem   (20px)
6  = 1.5rem    (24px)
8  = 2rem      (32px)
10 = 2.5rem    (40px)
12 = 3rem      (48px)
16 = 4rem      (64px)
20 = 5rem      (80px)
24 = 6rem      (96px)
```

### Border Radius

```
none = 0
sm   = 0.125rem  (2px)
base = 0.25rem   (4px)
md   = 0.375rem  (6px)
lg   = 0.5rem    (8px)
xl   = 0.75rem   (12px)
2xl  = 1rem      (16px)
full = 9999px    (Circular)
```

### Shadow System

```
sm   = Light shadow for subtle depth
base = Default shadow
md   = Medium shadow
lg   = Large shadow
xl   = Extra large shadow
```

## Using CSS Variables

Global CSS variables are defined in `src/styles.scss` and can be used directly in your HTML/CSS:

```css
/* Colors */
color: var(--primary-color);
background-color: var(--gray-100);

/* Typography */
font-family: var(--font-family);
font-size: var(--font-size-lg);
font-weight: var(--font-weight-semibold);

/* Spacing */
padding: var(--spacing-4);
margin: var(--spacing-6);

/* Borders & Shadows */
border-radius: var(--radius-lg);
box-shadow: var(--shadow-md);

/* Transitions */
transition: all var(--transition-duration-base) var(--transition-timing);
```

## Using SCSS Mixins

Import the variables file in your component styles to access mixins:

```scss
@import '../../styles/variables';

.my-component {
  // Flexbox utilities
  @include flex-center;
  
  // Responsive design
  @include respond-to('md') {
    // Mobile styles
  }
  
  // Transitions
  @include transition(all, base);
  
  // Forms
  input {
    @include form-control;
  }
  
  // Buttons
  button {
    @include button-primary;
  }
}
```

## Available Mixins

### Flexbox Shortcuts
- `@include flex-center;` - Center items both horizontally and vertically
- `@include flex-between;` - Space-between with centered alignment
- `@include flex-col;` - Flex column layout
- `@include flex-col-center;` - Centered flex column

### Responsive Design
- `@include respond-to('md')` - Mobile-first down to breakpoint
- `@include respond-from('md')` - Desktop-first from breakpoint

**Available Breakpoints:**
```
xs   = 480px
sm   = 640px
md   = 768px
lg   = 1024px
xl   = 1280px
2xl  = 1536px
```

### Transitions
- `@include transition($props, $duration);` - Easy transition shorthand
- `@include hover-lift;` - Hover lift effect with shadow

### Text Utilities
- `@include truncate;` - Single line text overflow
- `@include line-clamp(2);` - Multi-line text truncation

### Positioning
- `@include absolute-center;` - Center absolute positioned elements
- `@include absolute-fill;` - Fill parent container

### Components
- `@include card;` - Card styling
- `@include form-control;` - Form input styling
- `@include button-primary;` - Primary button styling
- `@include alert-success;` - Success alert styling

### Utilities
- `@include sr-only;` - Screen reader only text
- `@include custom-scrollbar();` - Custom scrollbar styling
- `@include grid(3, '6');` - CSS grid layout
- `@include hide-mobile;` - Hide on mobile
- `@include show-mobile;` - Show only on mobile

## Helper Functions

Convert design tokens to values:

```scss
@import '../../styles/variables';

.component {
  // Get colors
  color: color('primary');
  background: gray('100');
  
  // Get spacing
  padding: spacing('4');
  margin: spacing('6');
  
  // Get other tokens
  border-radius: radius('lg');
  box-shadow: shadow('md');
  font-size: font-size('lg');
  font-weight: font-weight('bold');
  z-index: z('modal');
}
```

## PrimeNG Integration

PrimeNG styles are configured in `angular.json` and PrimeNG components are styled through CSS overrides in `src/styles.scss`. Key styled components include:

### Buttons
```html
<button class="p-button p-button-primary">Primary Button</button>
<button class="p-button p-button-secondary">Secondary</button>
<button class="p-button p-button-outlined">Outlined</button>
<button class="p-button p-button-text">Text Only</button>
```

### Panels
```html
<p-panel>
  <ng-template pTemplate="header">
    Panel Title
  </ng-template>
  Panel content here
</p-panel>
```

### Messages/Alerts
```html
<p-message severity="success" text="Success message"></p-message>
<p-message severity="error" text="Error message"></p-message>
<p-message severity="warning" text="Warning message"></p-message>
<p-message severity="info" text="Info message"></p-message>
```

### Tables
```html
<p-datatable [value]="data">
  <p-column field="id" header="ID"></p-column>
  <p-column field="name" header="Name"></p-column>
</p-datatable>
```

## Component Styling Best Practices

### 1. Use BEM Naming
```scss
.card {
  background: white;
  
  &__header {
    border-bottom: 1px solid var(--gray-200);
  }
  
  &__title {
    font-size: var(--font-size-lg);
  }
  
  &--featured {
    box-shadow: var(--shadow-lg);
  }
}
```

### 2. Import Variables in Components
```scss
// card.component.scss
@import '../../styles/variables';

:host {
  display: block;
}

.card {
  @include card;
  
  &__title {
    font-size: font-size('lg');
    font-weight: font-weight('bold');
  }
}
```

### 3. Use CSS Variables for Dynamic Theming
```scss
.component {
  color: var(--primary-color);  // Changeable at runtime
  background: var(--gray-50);   // Easy to override
}
```

### 4. Responsive Design Pattern
```scss
.grid {
  @include grid(3, '6');        // 3 columns default
  
  @include respond-to('lg') {
    @include grid(2, '6');      // 2 columns on tablets
  }
  
  @include respond-to('md') {
    @include grid(1, '4');      // 1 column on mobile
  }
}
```

## Example Component

See `src/styles/_example-components.scss` for full examples including:
- Cards
- Forms
- Buttons
- Alerts
- Tables
- Grids
- Badges
- Avatars
- Skeletons
- And more...

## Utility Classes

Pre-defined utility classes for quick styling:

### Spacing
```html
<div class="mt-4 mb-6 p-4">Padded element</div>
```

### Flexbox
```html
<div class="flex flex-center">Centered content</div>
<div class="flex flex-between">Space between items</div>
<div class="flex-col">Column layout</div>
```

### Text
```html
<p class="text-primary">Primary color text</p>
<p class="text-bold">Bold text</p>
<p class="text-muted">Muted text</p>
<p class="text-sm">Small text</p>
```

### Display
```html
<div class="border rounded">Bordered rounded box</div>
<div class="border-top">Top border only</div>
```

## Accessibility Features

The styling system includes:

- **Focus Visible**: Clear keyboard navigation indicators
- **Color Contrast**: WCAG AA compliance
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **Screen Reader Only**: `.sr-only` utility class

## Theming

To change the theme:

1. **Update CSS Variables** in `src/styles.scss` `:root` block
2. **Update SCSS Variables** in `src/styles/_variables.scss` maps
3. **Override PrimeNG Theme** by changing the import at the top of `styles.scss`

Available PrimeNG themes:
- `lara-light-blue` (current)
- `lara-dark-blue`
- `bootstrap4`
- `material`
- And more...

## Responsive Design

Mobile-first approach with breakpoints:

| Device | Breakpoint | Width |
|--------|-----------|-------|
| Mobile | xs | 480px |
| Mobile | sm | 640px |
| Tablet | md | 768px |
| Desktop | lg | 1024px |
| Wide | xl | 1280px |
| Ultra Wide | 2xl | 1536px |

## Performance Considerations

- CSS variables are used for dynamic properties
- Minimal selectors for specificity control
- Mixins reduce code duplication
- Shadow DOM scoping in components
- No unused PrimeNG components imported

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support
- CSS Custom Properties support
- SCSS compilation required

## Customization Guide

### Add a New Color
```scss
// src/styles/_variables.scss
$colors: (
  ...existing colors...,
  'custom': #your-color,
);

// Use with function
color: color('custom');
```

### Add a New Spacing Value
```scss
// src/styles/_variables.scss
$spacings: (
  ...existing spacings...,
  '7': 1.75rem,
);

// Use with function
padding: spacing('7');
```

### Create a New Mixin
```scss
// src/styles/_variables.scss
@mixin my-custom-mixin {
  // Your styles
}

// Use in components
@include my-custom-mixin;
```

## Troubleshooting

### Variables not working
- Ensure `@import '../../styles/variables';` is at the top of your component styles
- Check the relative path is correct

### Styles not applying
- Check component `styleUrls` path is correct
- Verify SCSS compilation (Angular CLI handles this automatically)
- Check CSS specificity

### PrimeNG styles not visible
- Ensure PrimeNG imports are at the top of `styles.scss`
- Clear browser cache
- Check z-index layering

## Additional Resources

- [PrimeNG Documentation](https://primeng.org/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
