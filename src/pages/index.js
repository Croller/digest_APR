import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/Layout'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const TOC = data.allHtmlContent.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <ul>
          {TOC.map(({ node }) => (
            <li key={node.name}>
              <Link to={node.name}>{node.name}</Link>
            </li>
          ))}
        </ul>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allHtmlContent {
      edges {
        node {
          name
        }
      }
    }
  }
`
