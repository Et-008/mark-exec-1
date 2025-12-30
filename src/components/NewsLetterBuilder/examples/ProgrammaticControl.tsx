/**
 * Programmatic Control Example
 * 
 * This example shows how to control the newsletter builder programmatically
 * using the context API
 */

import React, { useEffect } from 'react';
import { NewsletterProvider, useNewsletter } from '../context/NewsletterContext';
import { NewsLetterBuilder } from '../NewsLetterBuilder';
import { createComponent } from '../utils/componentRegistry';

const ProgrammaticControlDemo: React.FC = () => {
  const { addComponent, state, exportToJSON, importFromJSON } = useNewsletter();

  // Add some default components on mount
  useEffect(() => {
    if (state.components.length === 0) {
      // Add a heading
      const heading = createComponent('heading');
      heading.text = 'Welcome to My Newsletter';
      heading.fontSize = 32;
      heading.alignment = 'center';
      addComponent(heading);

      // Add some text
      const text = createComponent('text');
      text.content = '<p>This is an automatically generated newsletter with sample content.</p>';
      addComponent(text);

      // Add a button
      const button = createComponent('button');
      button.text = 'Learn More';
      button.href = 'https://example.com';
      addComponent(button);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExportToConsole = () => {
    const json = exportToJSON();
    console.log('Newsletter JSON:', json);
    alert('Newsletter data exported to console!');
  };

  const handleLoadSample = () => {
    const sampleNewsletter = [
      {
        id: '1',
        type: 'heading',
        text: 'Sample Newsletter',
        level: 1,
        fontSize: 36,
        fontFamily: 'Arial, sans-serif',
        color: '#333333',
        alignment: 'center',
        fontWeight: 700
      },
      {
        id: '2',
        type: 'text',
        content: '<p>This is a sample newsletter loaded programmatically.</p>',
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        color: '#333333',
        alignment: 'left',
        lineHeight: 1.5
      }
    ];
    importFromJSON(JSON.stringify(sampleNewsletter));
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '16px 24px',
        backgroundColor: '#f0f8ff',
        borderBottom: '2px solid #007bff',
        display: 'flex',
        gap: '12px'
      }}>
        <button
          onClick={handleExportToConsole}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Export to Console
        </button>
        <button
          onClick={handleLoadSample}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Load Sample
        </button>
        <span style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: '14px', color: '#666' }}>
          Components: {state.components.length}
        </span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <NewsLetterBuilder />
      </div>
    </div>
  );
};

export const ProgrammaticControlExample: React.FC = () => {
  return (
    <NewsletterProvider>
      <ProgrammaticControlDemo />
    </NewsletterProvider>
  );
};

export default ProgrammaticControlExample;

