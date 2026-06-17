import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ApiError } from './ApiError'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erreur React capturee', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <ApiError message="L'interface a rencontre une erreur." />
    }

    return this.props.children
  }
}
