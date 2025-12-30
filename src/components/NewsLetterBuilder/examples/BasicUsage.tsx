/**
 * Basic Usage Example
 * 
 * This example shows the simplest way to use the Newsletter Builder
 */

import React from 'react';
import { NewsLetterBuilder } from '../index';

export const BasicUsageExample: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <NewsLetterBuilder />
    </div>
  );
};

export default BasicUsageExample;

