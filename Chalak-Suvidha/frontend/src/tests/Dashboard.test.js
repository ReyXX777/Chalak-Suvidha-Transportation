import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

test('renders Dashboard heading', () => {
    render(<Dashboard />);
    const headingElement = screen.getByText(/Dashboard/i);
    expect(headingElement).toBeInTheDocument();
});