# Paragraph Component

A rich text editing component for the Newsletter Builder with comprehensive text formatting capabilities.

## Features

### Text Formatting

- **Bold** - Make text bold (Ctrl/Cmd + B)
- **Italic** - Italicize text (Ctrl/Cmd + I)
- **Underline** - Underline text (Ctrl/Cmd + U)
- **Strikethrough** - Strike through text

### Special Formatting

- **Subscript** - Add subscript text (e.g., H₂O)
- **Superscript** - Add superscript text (e.g., E=mc²)

### Lists

- **Bullet List** - Create unordered lists
- **Numbered List** - Create ordered lists

### Text Alignment

- Left align
- Center align
- Right align
- Justify

### Typography Controls

- **Font Family** - Choose from 9 different fonts:

  - Arial
  - Helvetica
  - Georgia
  - Times New Roman
  - Courier New
  - Verdana
  - Trebuchet MS
  - Comic Sans MS
  - Impact

- **Font Size** - Select from predefined sizes (8px to 48px)
- **Text Color** - Choose any color with color picker
- **Line Height** - Adjust spacing between lines

### Emoji Support

- Full emoji support via keyboard or copy-paste
- All emojis render correctly in both editor and exported HTML

## How to Use

### Adding the Component

1. Click the "Paragraph" button (📄 icon) in the sidebar
2. The component will be added to your newsletter canvas

### Editing Content

1. Click on the paragraph component to select it
2. The rich text toolbar will appear above the component
3. Select text and use the toolbar buttons to apply formatting
4. Type directly to add or modify content

### Using the Toolbar

#### Text Formatting Buttons

- **B** - Bold
- **I** - Italic
- **U** - Underline
- **S** - Strikethrough

#### Special Text Buttons

- **X₂** - Subscript
- **X²** - Superscript

#### List Buttons

- **•** - Bullet list
- **1.** - Numbered list

#### Alignment Buttons

- **⬅** - Align left
- **↔** - Align center
- **➡** - Align right
- **⬌** - Justify

#### Dropdown Controls

- **Font Size** - Select size from dropdown
- **Font Family** - Choose font from dropdown
- **Color Picker** - Click to choose text color

### Property Panel Controls

When a paragraph is selected, the Property Panel on the right shows:

- Font Family selector
- Font Size input
- Text Color picker
- Background Color picker
- Alignment options
- Line Height slider

### Keyboard Shortcuts

- **Bold**: Ctrl/Cmd + B
- **Italic**: Ctrl/Cmd + I
- **Underline**: Ctrl/Cmd + U
- **Paste**: Ctrl/Cmd + V (plain text only)

## Example Usage

### Basic Text

```
Start writing your paragraph here...
```

### Formatted Text

```html
<p><strong>Bold text</strong> and <em>italic text</em></p>
```

### With Lists

```html
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>
```

### With Chemical Formulas

```html
<p>Water is H<sub>2</sub>O and Energy is E=mc<sup>2</sup></p>
```

### With Emojis

```html
<p>Welcome to our newsletter! 🎉 We're excited to share updates with you! 🚀</p>
```

## Technical Details

### Component Props

```typescript
interface ParagraphComponentProps {
  type: "paragraph";
  content: string; // HTML content
  fontSize?: number; // Default: 16
  fontFamily?: string; // Default: 'Arial, sans-serif'
  color?: string; // Default: '#333333'
  alignment?: "left" | "center" | "right" | "justify"; // Default: 'left'
  lineHeight?: number; // Default: 1.6
  backgroundColor?: string; // Default: 'transparent'
}
```

### Default Styles

- Font Size: 16px
- Font Family: Arial, sans-serif
- Color: #333333
- Alignment: Left
- Line Height: 1.6
- Background: Transparent

### HTML Export

The component exports to email-compatible HTML using table-based layouts for maximum email client compatibility.

## Best Practices

1. **Keep paragraphs concise** - Break long content into multiple paragraph components
2. **Use consistent formatting** - Maintain a consistent style throughout your newsletter
3. **Test emojis** - Not all email clients support all emojis
4. **Avoid excessive formatting** - Too many styles can make content hard to read
5. **Use lists for clarity** - Lists help organize information clearly

## Browser Compatibility

The rich text editor uses `contentEditable` and `document.execCommand` which are supported by:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Email Client Compatibility

The exported HTML is compatible with:

- Gmail
- Outlook (2013+)
- Apple Mail
- Yahoo Mail
- And most other modern email clients
