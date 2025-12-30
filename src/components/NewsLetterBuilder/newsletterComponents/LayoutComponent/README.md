# Layout Component

A powerful multi-column layout component for creating sophisticated newsletter designs with drag-and-drop functionality.

## Features

### Column Management
- **2-4 Column Layouts** - Create layouts with 2, 3, or 4 columns
- **Flexible Column Widths** - Choose from preset width distributions
- **Responsive Design** - Columns adapt to content

### Preset Column Layouts

#### 2-Column Layouts
- Equal (50% / 50%)
- 60% / 40%
- 40% / 60%
- 70% / 30%
- 30% / 70%

#### 3-Column Layouts
- Equal (33% / 33% / 33%)
- 50% / 25% / 25%
- 25% / 50% / 25%
- 25% / 25% / 50%

#### 4-Column Layout
- Equal (25% / 25% / 25% / 25%)

### Drag & Drop
- **Reorder Components** - Drag components within columns
- **Visual Feedback** - Clear indicators during dragging
- **Drop Zones** - Each column is a droppable area

### Nested Components
Supports all newsletter components within columns:
- Text blocks
- Paragraphs
- Headings
- Images
- Buttons
- Dividers
- Spacers
- Social Links

### Styling Options
- **Background Color** - Set layout background
- **Gap Control** - Adjust spacing between columns (0-50px)
- **Padding** - Control internal padding
- **Individual Column Styling** - Each column has distinct styling

## How to Use

### Adding the Component

1. Click the "Layout" button (📐 icon) in the sidebar
2. The component will be added to your newsletter with 2 empty columns by default

### Configuring Columns

#### Change Number of Columns

1. Select the layout component
2. In the Property Panel, use "Number of Columns" dropdown
3. Choose 2, 3, or 4 columns

#### Adjust Column Widths

1. Select the layout component
2. In the Property Panel, use "Column Layout" dropdown
3. Choose from preset width distributions

#### Adjust Column Gap

1. Select the layout component
2. In the Property Panel, adjust "Gap Between Columns"
3. Range: 0-50px

### Adding Components to Columns

**Method 1: Drag from Sidebar**
1. Select the layout component to see columns
2. Click and drag a component from the sidebar
3. Drop it into the desired column

**Method 2: Cut and Paste**
1. Add components to the main canvas
2. Select and cut components (Ctrl/Cmd + X)
3. Click inside a column and paste (Ctrl/Cmd + V)

### Managing Components Within Columns

#### Reorder Components
- Drag components up/down within the same column using the drag handle (⋮⋮)

#### Select Components
- Click on any component within a column to select it
- The Property Panel will show that component's properties

#### Delete Components
- Select a component within a column
- Click the red × button that appears

### Styling the Layout

#### Background Color
1. Select the layout component
2. In Property Panel, use "Background Color" picker
3. Choose your desired color

#### Padding
1. Select the layout component
2. In Property Panel, enter padding value
3. Examples: `16px`, `10px 20px`, `10px 20px 10px 20px`

## Use Cases

### 1. Newsletter Header
```
[Logo Image] | [Heading + Text]
   40%       |      60%
```

### 2. Product Showcase
```
[Image] | [Image] | [Image]
  33%   |   33%   |   33%
```

### 3. Feature Highlights
```
[Icon + Heading + Text] | [Icon + Heading + Text]
          50%           |           50%
```

### 4. Sidebar Layout
```
[Main Content] | [Sidebar]
      70%      |    30%
```

### 5. Four-Column Grid
```
[Item] | [Item] | [Item] | [Item]
  25%  |  25%   |  25%   |  25%
```

## Examples

### Example 1: Two Column Feature Section

```typescript
{
  type: 'layout',
  columns: [
    [
      { type: 'image', src: 'feature1.jpg', ... },
      { type: 'heading', text: 'Feature One', ... }
    ],
    [
      { type: 'image', src: 'feature2.jpg', ... },
      { type: 'heading', text: 'Feature Two', ... }
    ]
  ],
  columnWidths: ['50%', '50%'],
  gap: 16,
  backgroundColor: '#f8f9fa',
  padding: '20px'
}
```

### Example 2: Three Column Services

```typescript
{
  type: 'layout',
  columns: [
    [
      { type: 'heading', text: 'Service 1', ... },
      { type: 'paragraph', content: '<p>Description...</p>', ... }
    ],
    [
      { type: 'heading', text: 'Service 2', ... },
      { type: 'paragraph', content: '<p>Description...</p>', ... }
    ],
    [
      { type: 'heading', text: 'Service 3', ... },
      { type: 'paragraph', content: '<p>Description...</p>', ... }
    ]
  ],
  columnWidths: ['33.33%', '33.33%', '33.33%'],
  gap: 20,
  backgroundColor: 'transparent',
  padding: '0'
}
```

## Technical Details

### Component Props

```typescript
interface LayoutComponentProps {
  type: 'layout';
  columns: NewsletterComponent[][];   // 2D array of components
  columnWidths?: string[];             // e.g., ['50%', '50%']
  gap?: number;                        // Gap between columns (default: 16)
  backgroundColor?: string;            // Background color
  padding?: string;                    // CSS padding value
}
```

### Default Values

- Columns: 2 empty columns
- Column Widths: ['50%', '50%']
- Gap: 16px
- Background Color: transparent
- Padding: '0'

### Rendering

The component uses CSS Grid for column layout:
```css
display: grid;
grid-template-columns: [columnWidths];
gap: [gap]px;
```

### Drag & Drop Implementation

- Uses `react-beautiful-dnd` library
- Each column is a separate droppable area
- Components can be reordered within columns
- Visual feedback during drag operations

## Best Practices

### Layout Design

1. **Keep it Simple** - Don't overcomplicate layouts
2. **Mobile First** - Consider how layouts adapt on mobile
3. **Consistent Spacing** - Use consistent gaps throughout
4. **Visual Balance** - Balance content across columns

### Content Organization

1. **Group Related Content** - Keep related items in same column
2. **Visual Hierarchy** - Put important content in wider columns
3. **Equal Heights** - Try to balance column heights
4. **Whitespace** - Use spacers for breathing room

### Performance

1. **Limit Nesting** - Avoid layouts within layouts
2. **Optimize Images** - Use appropriately sized images
3. **Component Count** - Don't overload columns with too many components

## HTML Export

The layout exports to email-compatible HTML using nested tables:

```html
<table role="presentation" width="100%" style="background-color: [backgroundColor]">
  <tr>
    <td style="padding: [padding]">
      <table role="presentation" width="100%">
        <tr>
          <td valign="top" style="width: [columnWidth]%; padding: [gap]px">
            <!-- Column 1 components -->
          </td>
          <td valign="top" style="width: [columnWidth]%; padding: [gap]px">
            <!-- Column 2 components -->
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

## Email Client Compatibility

### Fully Supported
✅ Gmail
✅ Outlook 2013+
✅ Apple Mail
✅ Yahoo Mail
✅ Outlook.com
✅ iOS Mail
✅ Android Mail

### Partial Support
⚠️ Outlook 2007-2010 (columns may stack)

### Note on Mobile
On mobile devices, columns will typically stack vertically for better readability.

## Troubleshooting

### Columns Not Showing
- Make sure layout component is selected
- Check that columns array is populated
- Verify columnWidths are valid percentages

### Can't Drag Components Into Columns
- Ensure layout is on the canvas (not in sidebar)
- Click layout to activate drop zones
- Try refreshing the page

### Column Widths Not Equal
- Use the "Column Layout" dropdown in Property Panel
- Select "Equal" preset
- Or manually adjust columnWidths

### Components Overlapping
- Increase gap between columns
- Check column widths sum to 100%
- Adjust padding values

## Advanced Tips

### Creating Complex Layouts

Combine multiple layout components for complex designs:

1. Add first layout with 2 columns
2. Add second layout below with 3 columns
3. Use spacers between layouts for separation

### Responsive Design

Consider mobile users:
- Use 2 columns maximum for mobile-friendly layouts
- Test how content stacks on narrow screens
- Avoid very small column widths

### Styling Tricks

- Use background colors to create visual sections
- Add dividers between columns
- Use consistent padding throughout newsletter

## Keyboard Shortcuts

- **Select**: Click on component
- **Delete**: Select and press Delete key (or click × button)
- **Copy**: Ctrl/Cmd + C (future feature)
- **Paste**: Ctrl/Cmd + V (future feature)

## Visual Indicators

- **Blue Dashed Border**: Droppable column area
- **Blue Background**: Active drag-over state
- **Red × Button**: Delete component
- **⋮⋮ Handle**: Drag to reorder

## Future Enhancements

Potential improvements:
- Nested layouts
- Custom column widths (manual input)
- Column background colors
- Column borders
- Vertical alignment options
- Cross-column drag & drop
- Column templates

## Summary

The Layout Component is a powerful tool for creating professional, multi-column newsletter layouts with:
- ✅ 2-4 column support
- ✅ Flexible width presets
- ✅ Drag & drop functionality
- ✅ All component types supported
- ✅ Email-compatible export
- ✅ Visual editing interface
- ✅ Responsive design considerations

Perfect for creating engaging, well-organized newsletters!






