import React, { useState } from 'react';

// Mock authentication service
const authService = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Basic validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Simple mock authentication
    const validEmail = 'user@example.com';
    const validPassword = 'password123';

    if (email === validEmail && password === validPassword) {
      return {
        user: {
          id: '1',
          email: email,
          name: 'John Doe'
        },
        token: 'mock_auth_token_' + Math.random().toString(36).substring(2)
      };
    } else {
      throw new Error('Invalid email or password');
    }
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate input
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      // Store token (in a real app, use secure storage)
      localStorage.setItem('authToken', response.token);
      
      // Simulate successful login redirect
      alert('Login successful! Redirecting...');
      console.log('Logged in user:', response.user);
      
      // In a real app, you would use routing to navigate
      // history.push('/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login to Chalak Suvidha</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
              required 
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-help">
          <p>Hint: Use email 'user@example.com' and password 'password123'</p>
        </div>
      </div>
    </div>
  );
};

export default Login;