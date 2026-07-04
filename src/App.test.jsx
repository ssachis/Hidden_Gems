import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

test('renders landing screen by default', () => {
  render(<App />);
  const heading = screen.getByText(/Where to next/i);
  expect(heading).toBeDefined();
});
