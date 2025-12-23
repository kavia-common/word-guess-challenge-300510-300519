import { render, screen } from '@testing-library/react';
import App from './App';

// Keeping the default CRA smoke test to ensure base app renders.
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
