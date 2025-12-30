import React from 'react';
import { ParagraphComponent } from './ParagraphComponent';
import { ParagraphComponentProps } from '../../types';

/**
 * Example usage of the ParagraphComponent
 * This demonstrates various formatting capabilities
 */

// Example 1: Basic paragraph
export const BasicParagraphExample = () => {
  const basicParagraph: ParagraphComponentProps = {
    id: 'example-1',
    type: 'paragraph',
    content: '<p>This is a simple paragraph with default styling.</p>',
    fontSize: 16,
    fontFamily: 'Arial, sans-serif',
    color: '#333333',
    alignment: 'left',
    lineHeight: 1.6,
  };

  return (
    <ParagraphComponent
      component={basicParagraph}
      isSelected={false}
      isEditing={false}
    />
  );
};

// Example 2: Formatted text with bold and italic
export const FormattedParagraphExample = () => {
  const formattedParagraph: ParagraphComponentProps = {
    id: 'example-2',
    type: 'paragraph',
    content: '<p>This paragraph includes <strong>bold text</strong>, <em>italic text</em>, and <u>underlined text</u>.</p>',
    fontSize: 16,
    fontFamily: 'Georgia, serif',
    color: '#2c3e50',
    alignment: 'left',
    lineHeight: 1.8,
  };

  return (
    <ParagraphComponent
      component={formattedParagraph}
      isSelected={false}
      isEditing={false}
    />
  );
};

// Example 3: Paragraph with lists
export const ListParagraphExample = () => {
  const listParagraph: ParagraphComponentProps = {
    id: 'example-3',
    type: 'paragraph',
    content: `
      <p>Here are our key features:</p>
      <ul>
        <li>Easy to use interface</li>
        <li>Rich text formatting</li>
        <li>Export to HTML</li>
      </ul>
    `,
    fontSize: 16,
    fontFamily: 'Verdana, sans-serif',
    color: '#34495e',
    alignment: 'left',
    lineHeight: 1.6,
  };

  return (
    <ParagraphComponent
      component={listParagraph}
      isSelected={false}
      isEditing={false}
    />
  );
};

// Example 4: Scientific notation with subscript and superscript
export const ScientificParagraphExample = () => {
  const scientificParagraph: ParagraphComponentProps = {
    id: 'example-4',
    type: 'paragraph',
    content: '<p>The chemical formula for water is H<sub>2</sub>O, and Einstein\'s famous equation is E=mc<sup>2</sup>.</p>',
    fontSize: 16,
    fontFamily: 'Times New Roman, serif',
    color: '#2c3e50',
    alignment: 'left',
    lineHeight: 1.6,
  };

  return (
    <ParagraphComponent
      component={scientificParagraph}
      isSelected={false}
      isEditing={false}
    />
  );
};

// Example 5: Centered paragraph with custom styling
export const CenteredParagraphExample = () => {
  const centeredParagraph: ParagraphComponentProps = {
    id: 'example-5',
    type: 'paragraph',
    content: '<p><strong>Welcome to Our Newsletter!</strong></p><p>We\'re excited to share our latest updates with you.</p>',
    fontSize: 20,
    fontFamily: 'Helvetica, sans-serif',
    color: '#ffffff',
    backgroundColor: '#3498db',
    alignment: 'center',
    lineHeight: 1.5,
  };

  return (
    <ParagraphComponent
      component={centeredParagraph}
      isSelected={false}
      isEditing={false}
    />
  );
};

// Example 6: Paragraph with emojis
export const EmojiParagraphExample = () => {
  const emojiParagraph: ParagraphComponentProps = {
    id: 'example-6',
    type: 'paragraph',
    content: '<p>🎉 Congratulations! 🎊 You\'ve unlocked all features! 🚀</p>',
    fontSize: 18,
    fontFamily: 'Arial, sans-serif',
    color: '#27ae60',
    alignment: 'center',
    lineHeight: 1.6,
  };

  return (
    <ParagraphComponent
      component={emojiParagraph}
      isSelected={false}
      isEditing={false}
    />
  );
};

// Example 7: Mixed formatting (comprehensive)
export const ComprehensiveParagraphExample = () => {
  const comprehensiveParagraph: ParagraphComponentProps = {
    id: 'example-7',
    type: 'paragraph',
    content: `
      <p><strong>Newsletter Update - December 2024</strong> 📰</p>
      <p>Dear subscribers,</p>
      <p>We're thrilled to announce our <em>latest features</em>:</p>
      <ol>
        <li><strong>Rich text editor</strong> with formatting options</li>
        <li>Support for <sub>subscript</sub> and <sup>superscript</sup></li>
        <li><u>Beautiful</u> typography controls</li>
      </ol>
      <p>Visit our website at <a href="#">www.example.com</a> for more details!</p>
      <p>Best regards,<br/>The Team 🎯</p>
    `,
    fontSize: 16,
    fontFamily: 'Arial, sans-serif',
    color: '#2c3e50',
    alignment: 'left',
    lineHeight: 1.7,
  };

  return (
    <ParagraphComponent
      component={comprehensiveParagraph}
      isSelected={false}
      isEditing={false}
    />
  );
};

// Example 8: Interactive editing mode
export const InteractiveParagraphExample = () => {
  const [paragraph, setParagraph] = React.useState<ParagraphComponentProps>({
    id: 'example-8',
    type: 'paragraph',
    content: '<p>Click to edit this paragraph and use the toolbar to format text!</p>',
    fontSize: 16,
    fontFamily: 'Arial, sans-serif',
    color: '#333333',
    alignment: 'left',
    lineHeight: 1.6,
  });

  const [isEditing, setIsEditing] = React.useState(true);

  const handleContentChange = (content: string) => {
    setParagraph({ ...paragraph, content });
  };

  const handleUpdate = (updates: Partial<ParagraphComponentProps>) => {
    setParagraph({ ...paragraph, ...updates });
  };

  return (
    <div>
      <ParagraphComponent
        component={paragraph}
        isSelected={isEditing}
        isEditing={isEditing}
        onContentChange={handleContentChange}
        onUpdate={handleUpdate}
      />
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Stop Editing' : 'Start Editing'}
      </button>
    </div>
  );
};

// Demonstration component showing all examples
export const ParagraphComponentDemo = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Paragraph Component Examples</h1>
      
      <section style={{ marginBottom: '30px' }}>
        <h2>1. Basic Paragraph</h2>
        <BasicParagraphExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>2. Formatted Text</h2>
        <FormattedParagraphExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>3. Lists</h2>
        <ListParagraphExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>4. Scientific Notation</h2>
        <ScientificParagraphExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>5. Centered with Background</h2>
        <CenteredParagraphExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>6. With Emojis</h2>
        <EmojiParagraphExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>7. Comprehensive Example</h2>
        <ComprehensiveParagraphExample />
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>8. Interactive Editing</h2>
        <InteractiveParagraphExample />
      </section>
    </div>
  );
};

