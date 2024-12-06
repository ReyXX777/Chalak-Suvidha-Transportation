import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

test('renders Navbar with links', () => {
    render(<Navbar />);
    const logoElement = screen.getByText(/Chalak Suvidha/i);
    expect(logoElement).toBeInTheDocument();

    const homeLink = screen.getByText(/Home/i);
    expect(homeLink).toBeInTheDocument();

    const loginLink = screen.getByText(/Login/i);
    expect(loginLink).toBeInTheDocument();

    const dashboardLink = screen.getByText(/Dashboard/i);
    expect(dashboardLink).toBeInTheDocument();
});