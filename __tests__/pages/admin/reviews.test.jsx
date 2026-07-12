/**
 * Test for the Admin Reviews page – verifies the empty‑state UI renders correctly.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewsPage from '@/pages/admin/reviews';

// Mock heavy UI components and Next.js utils.
jest.mock('@/components/admin/AdminLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock('@/components/admin/EmptyState', () => ({
  __esModule: true,
  default: ({ title, description }) => (
    <div data-testid="empty-state">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  ),
}));
jest.mock('@/components/admin/Breadcrumbs', () => ({
  __esModule: true,
  default: () => <nav />,
}));
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));
jest.mock('lucide-react', () => ({
  __esModule: true,
  Search: () => <svg />,
  Download: () => <svg />,
  ChevronLeft: () => <svg />,
  ChevronRight: () => <svg />,
  X: () => <svg />,
}));

describe('Admin Reviews page', () => {
  test('renders the empty‑state when no review data exists', () => {
    render(<ReviewsPage />);
    const empty = screen.getByTestId('empty-state');
    expect(empty).toBeInTheDocument();
    expect(empty).toHaveTextContent('No reviews yet');
    expect(empty).toHaveTextContent('Reviews will appear here once customers submit them.');
  });
});
