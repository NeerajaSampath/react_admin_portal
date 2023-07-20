import React, { Component } from 'react';
import styled from 'styled-components';

export class ErrorBoundary extends Component {

  constructor(props) {
    super(props);
    this.state = {
       error: null,
    }
  }
  componentDidCatch(error,errorInfo){
    console.log({error, errorInfo});
  }
  static getDerivedStateFromError(error){
    return {error};
  }
  render() {
    if(this.state.error)
    return <ErrorBound>
        <h1>Something went Wrong</h1>
        <p>Sorry, something went wrong there. Try again </p>
      </ErrorBound>;
    return this.props.children;
  }
}

export default ErrorBoundary;
const ErrorBound = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    flex-direction: column;
    h1{
        font-size: 40px;
        font-weight: 900;
    }
    p{
        margin-top: 20px;
        font-size: 14px;
        font-weight: 300;
    }
    .goBack{
        margin-top: 20px !important;
    }
`