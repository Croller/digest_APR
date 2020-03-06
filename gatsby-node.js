const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

// exports.onCreateNode = async ({
//   node, loadNodeContent, actions, createContentDigest, createNodeId
// }) => {
//   if (node.internal.type !== 'File' || node.internal.mediaType !== 'text/html') return;

//   const { createNode, createParentChildLink } = actions;
//   const nodeContent = await loadNodeContent(node);

//   const htmlNodeContent = {
//     content: nodeContent,
//     // use name as identifier
//     name: node.name,
//   }

//   const htmlNodeMeta = {
//     id: createNodeId(`html-${node.id}`),
//     parent: node.id,
//     internal: {
//       type: 'HTMLContent',
//       mediaType: 'text/html',
//       content: JSON.stringify(htmlNodeContent),
//       contentDigest: createContentDigest(htmlNodeContent),
//     },
//   }

//   const htmlNode = Object.assign({}, htmlNodeContent, htmlNodeMeta);
//   createNode(htmlNode);
//   createParentChildLink({ parent: node, child: htmlNode });
// }

// exports.createPages = async ({ graphql, actions }) => {
//   const { createPage } = actions;
//   const Template = path.resolve(__dirname, 'src/templates/blog-post.js')

//   const result = await graphql(`
//   {
//     allHtmlContent {
//       edges {
//         node {
//           name
//           content
//         }
//       }
//     }
//   }
//   `)

//   if (result.errors) throw result.errors;
//   result.data.allHtmlContent.edges.forEach(({ node }) => {
//     createPage({
//       path: node.name,
//       component: Template,
//       context: {
//         name: node.name,
//       }
//     })
//   })
// }