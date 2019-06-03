import React from 'react';
import { Note } from '@contentful/forma-36-react-components';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      <Note noteType="negative">Something went wrong!</Note>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
