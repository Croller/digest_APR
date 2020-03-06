import React from "react"
import { Link, graphql } from "gatsby"
import get from 'lodash.get'
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import { remarkForm, DeleteAction } from "gatsby-tinacms-remark"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const { fields } = post
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext
  console.log(data);
  
  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article>
        <header>
          <h1
            style={{
              marginTop: rhythm(1),
              marginBottom: 0,
            }}
          >
            {post.frontmatter.title}
          </h1>
          <p
            style={{
              ...scale(-1 / 5),
              display: `block`,
              marginBottom: rhythm(1),
            }}
          >
            {post.frontmatter.date}
          </p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <footer>
          <Bio />
        </footer>
      </article>

      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}


/**
 * This object defines the form for editing blog post.
 */
const BlogPostForm = {
  actions: [ DeleteAction ],
  /**
   * The list of fields tell us what the form looks like.
   */
  fields: [
    /**
     * This is a field definition. There are many types of
     * components available, including:
     *
     * * text
     * * textarea
     * * toggle
     * * date
     * * markdown
     * * color
     * * group
     * * group-list
     * * blocks
     */
    // group
    {
      label: 'Authors List',
      name: 'rawJson.authors',
      component: 'group-list',
      description: 'Authors List',
      itemProps: item => ({
        key: item.id,
        label: item.name,
      }),
      defaultItem: () => ({
        name: 'New Author',
        id: Math.random()
          .toString(36)
          .substr(2, 9),
      }),
      fields: [
        {
          label: 'Name',
          name: 'name',
          component: 'text',
        },
        {
          label: 'Best Novel',
          name: 'best-novel',
          component: 'text',
        },
      ],
    },
    // image thumbnail
    {
      name: 'rawFrontmatter.thumbnail',
      label: 'Thumbnail',
      component: 'image',

      previewSrc: (formValues, { input }) => {
        const path = input.name.replace('rawFrontmatter', 'frontmatter')
        const gatsbyImageNode = get(formValues, path)
        if (!gatsbyImageNode) return ''
        //specific to gatsby-image
        return gatsbyImageNode.childImageSharp.fluid.src
      },

      uploadDir: () => {
        return '/content/images/'
      },

      parse: filename => `../images/${filename}`,
    },
    // color
    {
      name: 'rawFrontmatter.background_color',
      component: 'color',
      label: 'Background Color',
      description: 'Edit the page background color here',
      colorFormat: 'hex',
      colors: ['#EC4815', '#241748', '#B4F4E0', '#E6FAF8'],
      widget: 'sketch',
    },
    {
      //
      name: "frontmatter.title",
      component: "text",
      label: "Title",
      required: true,
    },
    { name: "frontmatter.date", component: "date", label: "Date" },
    {
      name: "frontmatter.description",
      component: "textarea",
      label: "Short info",
    },
    { name: "rawMarkdownBody", component: "markdown", label: "Body" },
  ],
}

/**
 * The `remarkForm` higher order component wraps the `BlogPostTemplate`
 * and generates a new form from the data in the `markdownRemark` query.
 */
export default remarkForm(BlogPostTemplate, BlogPostForm)

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      fields {
        slug
      }
      html
      frontmatter {
        title
        date(formatString: "DD.MM.YYYY")
        description
      }
      ...TinaRemark
    }
    allImageSharp {
      edges {
        node {
          fixed {
            base64
          }
          parent {
            ... on File {
              id
              name
              relativePath
            }
          }
        }
      }
    }
  }
`

