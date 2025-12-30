# Newsletter Builder - Quick Start Guide

Get started with the Newsletter Builder in just a few minutes!

## Step 1: Install Dependencies

```bash
yarn add react-beautiful-dnd uuid react-contenteditable html-react-parser @types/react-beautiful-dnd
```

## Step 2: Import and Use

### Simple Usage

```tsx
import { NewsLetterBuilder } from './components/NewsLetterBuilder';

function App() {
  return <NewsLetterBuilder />;
}
```

That's it! The builder is fully functional with this simple setup.

## Step 3: Start Building

### Adding Components

1. Click any component from the **left sidebar** to add it to your newsletter
2. Components include:
   - 📝 Text Block
   - 📌 Heading (H1, H2, H3)
   - 🖼️ Image
   - 🔘 Button
   - ➖ Divider
   - ↕️ Spacer
   - 📐 Layout (columns)
   - 🔗 Social Links

### Editing Components

1. Click on any component in the canvas to select it
2. Edit properties in the **right panel**:
   - Change colors, fonts, sizes
   - Adjust spacing and alignment
   - Set URLs for images and buttons
   - Configure social media links

3. Edit content directly:
   - Text and headings are **inline editable** - just click and type
   - Images can be uploaded by clicking on them when selected

### Reordering Components

- Hover over a component to see the drag handle (⋮⋮) on the left
- Click and drag to reorder components

### Deleting Components

- Select a component
- Click the **X button** in the top-right corner
- Or use the **Delete button** in the property panel

## Step 4: Preview and Export

### Preview

- Click the **👁️ Preview** button in the toolbar
- View your newsletter in a modal with accurate rendering

### Export

- **💾 Export HTML**: Download as a complete HTML file
- **📋 Copy HTML**: Copy HTML to clipboard
- **📥 Save**: Save as JSON for later editing
- **📤 Load**: Load a previously saved JSON file

### View Modes

- Toggle between **desktop (🖥️)** and **mobile (📱)** views
- See how your newsletter looks on different devices

## Step 5: Advanced Features

### Undo/Redo

- **Undo**: Click ↶ or press `Ctrl+Z` (or `Cmd+Z` on Mac)
- **Redo**: Click ↷ or press `Ctrl+Y` (or `Cmd+Shift+Z` on Mac)
- History saves up to 50 states

### Duplicate Components

- Select a component
- Click **Duplicate** in the property panel
- The duplicated component appears right after the original

### Clear All

- Click **🗑️ Clear All** in the toolbar
- Confirms before deleting all components

## Common Use Cases

### Creating a Simple Newsletter

1. Add a **Heading** for the title
2. Add **Text** blocks for content
3. Add an **Image** to make it visual
4. Add a **Button** for your call-to-action
5. Add a **Divider** to separate sections
6. Preview and export!

### Adding Social Media Links

1. Add a **Social Links** component
2. Select it to open the property panel
3. Check the platforms you want to include
4. Enter the URL for each platform
5. Customize icon size and spacing

### Creating Multi-Column Layouts

1. Add a **Layout** component
2. Select it and configure columns in the property panel
3. Adjust column widths and spacing
4. (Note: Nested content in layouts coming in future updates)

## Tips and Tricks

1. **Save Often**: Use the Save button to export JSON backups
2. **Use Spacers**: Add vertical spacing between sections with Spacer components
3. **Test in Preview**: Always preview before exporting
4. **Mobile View**: Check mobile view to ensure responsiveness
5. **Alt Text**: Always add alt text to images for accessibility
6. **Button URLs**: Use full URLs (https://...) for buttons and links

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo (alternative) |
| `Delete` | Delete selected component |

## Troubleshooting

### Components not dragging?
- Make sure `react-beautiful-dnd` is installed
- Try refreshing the page

### Images not loading?
- Check that the image URL is accessible
- Try uploading the image directly

### Export HTML not working in email clients?
- Email clients have strict HTML/CSS support
- Test in multiple clients
- Keep designs simple for best compatibility

### Styles not applying?
- Make sure CSS modules are configured in your webpack/bundler
- Check that all `.module.css` files are being loaded

## Next Steps

- Explore the examples in the `examples/` directory
- Read the full documentation in `README.md`
- Customize default styles in `utils/defaultStyles.ts`
- Add custom validation rules in `utils/validation.ts`

## Need Help?

- Check the full README for detailed documentation
- Look at example files for inspiration
- Review the TypeScript types for API reference

Happy newsletter building! 🎉

