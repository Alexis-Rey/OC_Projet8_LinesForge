import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erreur capturée :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <p>Une erreur est survenue dans l'affichage 😬</p>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;