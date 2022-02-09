import React from 'react'
import App from 'next/app'
import { createGlobalStyle } from 'styled-components'
import normalize from 'styled-normalize'
import { ReactQueryDevtools } from 'react-query/devtools'

//

import { Wrapper, Main } from '../components/styled'
import Sidebar from '../components/Sidebar'
import { QueryClient, QueryClientProvider } from 'react-query'

//

const GlobalStyles = createGlobalStyle`
  ${normalize};
  html, body, body, [data-reactroot] {
    min-height: 100%;
    max-width: 100%;
  }

  html, body {
    width: 100%;
    font-size: 20px;
    font-family: "Helvetica", "Georgia", sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  input {
    max-width: 100%;
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }
`

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    const queryClient = new QueryClient()

    return (
      <QueryClientProvider client={queryClient}>
        <Wrapper>
          <GlobalStyles />
          <Main>
            <Component {...pageProps} />
          </Main>
        </Wrapper>
        <ReactQueryDevtools />
      </QueryClientProvider>
    )
  }
}
