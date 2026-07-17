import { urlFor } from '@/lib/client'

/**
 * Shared Portable Text components for blog, stories, product tabs, about, etc.
 *
 * IMPORTANT: Always define `block` + `marks` explicitly.
 * Relying only on `types.image` with library defaults can skip or mis-style
 * text in some host/CSS combinations. Text blocks use high-contrast colors
 * so they never inherit an invisible theme token.
 */

const bodyText = {
  color: '#2a2a2a',
  fontSize: '1.05rem',
  lineHeight: 1.8,
  margin: '0 0 1.25rem',
}

const headingBase = {
  color: '#0d1b2a',
  fontWeight: 800,
  lineHeight: 1.25,
  margin: '2rem 0 1rem',
}

export const portableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = value?.asset
        ? urlFor(value).width(800).auto('format').url()
        : ''

      return (
        <figure style={{ margin: '2rem 0', textAlign: 'center' }}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={value.alt || ''}
              style={{ width: '100%', borderRadius: '8px', objectFit: 'contain' }}
            />
          ) : null}
          {value.caption ? (
            <figcaption
              style={{ marginTop: '0.75rem', color: '#666', fontSize: '0.925rem' }}
            >
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      )
    },
  },

  // Explicit block styles — normal + headings used in journal posts
  block: {
    normal: ({ children }) => <p style={bodyText}>{children}</p>,
    h1: ({ children }) => (
      <h1 style={{ ...headingBase, fontSize: '2rem' }}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ ...headingBase, fontSize: '1.6rem' }}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ ...headingBase, fontSize: '1.25rem', fontWeight: 700 }}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 style={{ ...headingBase, fontSize: '1.1rem', fontWeight: 700 }}>
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{
          margin: '1.5rem 0',
          padding: '0.75rem 1.25rem',
          borderLeft: '4px solid #C9A84C',
          color: '#3d2b1f',
          fontStyle: 'italic',
          background: 'rgba(201,168,76,0.08)',
        }}
      >
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul
        style={{
          margin: '0 0 1.25rem',
          paddingLeft: '1.5rem',
          color: '#2a2a2a',
          lineHeight: 1.8,
        }}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        style={{
          margin: '0 0 1.25rem',
          paddingLeft: '1.5rem',
          color: '#2a2a2a',
          lineHeight: 1.8,
        }}
      >
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li style={{ marginBottom: '0.5rem' }}>{children}</li>,
    number: ({ children }) => <li style={{ marginBottom: '0.5rem' }}>{children}</li>,
  },

  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
    em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    code: ({ children }) => (
      <code
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: '0.9em',
          background: 'rgba(0,0,0,0.06)',
          padding: '0.1em 0.35em',
          borderRadius: 4,
        }}
      >
        {children}
      </code>
    ),
    underline: ({ children }) => (
      <span style={{ textDecoration: 'underline' }}>{children}</span>
    ),
    'strike-through': ({ children }) => (
      <span style={{ textDecoration: 'line-through' }}>{children}</span>
    ),
    link: ({ value, children }) => {
      const href = value?.href || '#'
      const external = /^https?:\/\//i.test(href)
      return (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          style={{ color: '#8B1A1A', textDecoration: 'underline' }}
        >
          {children}
        </a>
      )
    },
  },

  // Never silently drop unknown custom blocks in production debugging
  unknownType: ({ value }) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[PortableText] Unknown type skipped:', value?._type, value)
    }
    return null
  },

  hardBreak: () => <br />,
}

export default portableTextComponents
