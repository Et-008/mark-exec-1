/**
 * Advanced Usage Example
 * 
 * This example shows how to use the Newsletter Builder with custom wrappers
 * and access to the context for advanced features
 */

import React from 'react';
import { NewsletterProvider, useNewsletter } from '../context/NewsletterContext';
import { NewsLetterBuilder } from '../NewsLetterBuilder';

// Custom header component that uses the newsletter context
const CustomHeader: React.FC = () => {
  const { state } = useNewsletter();
  
  return (
    <div style={{
      padding: '16px 24px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ margin: 0, fontSize: '18px' }}>My Newsletter Builder</h1>
      <span style={{ fontSize: '14px', color: '#666' }}>
        {state.components.length} component{state.components.length !== 1 ? 's' : ''}
      </span>
    </div>
  );
};

// Custom footer component
const CustomFooter: React.FC = () => {
  return (
    <div style={{
      padding: '12px 24px',
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #e0e0e0',
      textAlign: 'center',
      fontSize: '12px',
      color: '#666'
    }}>
      © 2025 Newsletter Builder. All rights reserved.
    </div>
  );
};

export const AdvancedUsageExample: React.FC = () => {
  return (
    <NewsletterProvider>
      <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CustomHeader />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <NewsLetterBuilder />
        </div>
        <CustomFooter />
      </div>
    </NewsletterProvider>
  );
};

export default AdvancedUsageExample;

