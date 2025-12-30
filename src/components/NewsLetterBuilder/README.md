# Newsletter Builder

A comprehensive drag-and-drop newsletter builder component built with React and TypeScript.

## Features

- 🎨 **Drag-and-Drop Interface**: Easily add and reorder components
- 📝 **Rich Text Editing**: Inline editing for text and headings
- 🖼️ **Multiple Components**: Text, Heading, Image, Button, Divider, Spacer, Layout, Social Links
- 🎨 **Customizable Styling**: Adjust colors, fonts, spacing, alignment, and more
- 📱 **Responsive Preview**: Toggle between desktop and mobile views
- ↩️ **Undo/Redo**: Full history management (up to 50 states)
- 💾 **Export Options**: Export as HTML or JSON
- 👁️ **Live Preview**: Preview your newsletter in a modal
- 🔄 **Save/Load**: Save your work and load it later

## Installation

First, install the required dependencies:

```bash
yarn add react-beautiful-dnd uuid react-contenteditable html-react-parser @types/react-beautiful-dnd
```

or with npm:

```bash
npm install react-beautiful-dnd uuid react-contenteditable html-react-parser @types/react-beautiful-dnd
```

## Usage

### Basic Usage

```tsx
import { NewsLetterBuilder } from './components/NewsLetterBuilder';

function App() {
  return <NewsLetterBuilder />;
}
```

### With Custom Wrapper

```tsx
import { NewsletterProvider, NewsLetterBuilder } from './components/NewsLetterBuilder';

function App() {
  return (
    <NewsletterProvider>
      <YourCustomHeader />
      <NewsLetterBuilder />
      <YourCustomFooter />
    </NewsletterProvider>
  );
}
```

## Available Components

### Text Component
- Rich text editing with inline HTML
- Customizable font family, size, color, alignment
- Line height control

### Heading Component
- Three levels (H1, H2, H3)
- Adjustable font size, weight, color
- Text alignment options

### Image Component
- Upload images or use URLs
- Optional link URL
- Border radius, alignment control
- Alt text for accessibility

### Button Component
- Customizable text and URL
- Background and text colors
- Border radius and padding
- Alignment options

### Divider Component
- Three styles: solid, dashed, dotted
- Adjustable color, thickness, width
- Margin control

### Spacer Component
- Adjustable height for vertical spacing
- Visual indicator in builder

### Layout Component
- Multi-column layouts (coming soon)
- Adjustable column widths and gaps

### Social Links Component
- Support for Facebook, Twitter, Instagram, LinkedIn, YouTube, GitHub
- Customizable icon size and spacing
- Circular or square icon styles

## Keyboard Shortcuts

- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z`: Redo

## Export Formats

### HTML Export
Exports a complete, email-compatible HTML document with:
- Inline styles for email client compatibility
- Table-based layout for maximum compatibility
- 600px max-width (standard email width)
- Proper DOCTYPE and meta tags

### JSON Export
Exports the newsletter structure as JSON for:
- Saving work in progress
- Loading previous newsletters
- Integration with other systems

## Architecture

```
NewsLetterBuilder/
├── components/          # UI components
│   ├── Canvas/         # Main editing area
│   ├── Sidebar/        # Component palette
│   ├── Toolbar/        # Top toolbar
│   ├── PropertyPanel/  # Property editor
│   ├── DraggableWrapper/ # Drag-and-drop wrapper
│   └── PreviewModal/   # Preview modal
├── newsletterComponents/ # Newsletter components
│   ├── TextComponent/
│   ├── HeadingComponent/
│   ├── ImageComponent/
│   ├── ButtonComponent/
│   ├── DividerComponent/
│   ├── SpacerComponent/
│   ├── LayoutComponent/
│   └── SocialLinksComponent/
├── context/            # State management
│   └── NewsletterContext.tsx
├── utils/              # Utilities
│   ├── componentRegistry.ts
│   ├── defaultStyles.ts
│   ├── htmlExport.ts
│   └── validation.ts
└── types.ts            # TypeScript types
```

## Browser Compatibility

The builder is tested and compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Exported HTML emails are tested in:
- Gmail (web and mobile)
- Outlook (desktop and web)
- Apple Mail
- Yahoo Mail

## Customization

### Default Styles
Modify default component styles in `utils/defaultStyles.ts`

### Component Registry
Add or modify component types in `utils/componentRegistry.ts`

### Validation Rules
Customize validation rules in `utils/validation.ts`

## Performance

- Components are memoized for optimal rendering
- Drag-and-drop is optimized with react-beautiful-dnd
- History is limited to 50 states to prevent memory issues

## Accessibility

- Alt text support for images
- Semantic HTML in exports
- ARIA labels for interactive elements
- Keyboard navigation support

## Known Limitations

- Layout component (multi-column) nesting is basic
- Social icons use placeholder images in HTML export
- Maximum history: 50 undo/redo states
- CSS modules required for styling

## Future Enhancements

- [ ] Template gallery
- [ ] Import existing HTML newsletters
- [ ] A/B testing variants
- [ ] Send test email functionality
- [ ] Component library (save reusable blocks)
- [ ] Advanced layout nesting
- [ ] Custom font uploads
- [ ] Image library integration

## License

MIT

## Support

For issues, questions, or contributions, please contact the development team.

