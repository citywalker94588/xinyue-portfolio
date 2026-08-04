import { Component } from 'react'
import BallpitFallback from './BallpitFallback.jsx'

export default class BallpitBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return <div className="ballpitFallback"><BallpitFallback colors={this.props.colors}/></div>
    }
    return this.props.children
  }
}

