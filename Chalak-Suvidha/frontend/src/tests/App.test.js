import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders home link', () => {
    render(<App />);
    const linkElement = screen.getByText(/Home/i);
    expect(linkElement).toBeInTheDocument();
});

test('renders login link', () => {
    render(<App />);
    const linkElement = screen.getByText(/Login/i);
    expect(linkElement).toBeInTheDocument();
});

test('renders dashboard link', () => {
    render(<App />);
    const linkElement = screen.getByText(/Dashboard/i);
    expect(linkElement).toBeInTheDocument();
});