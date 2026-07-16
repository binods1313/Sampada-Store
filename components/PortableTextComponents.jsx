import { urlFor } from '@/lib/client'

export const portableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = value?.asset ? urlFor(value).width(800).auto('format').url() : ''

      return (
        <figure style={{ margin: '2rem 0', textAlign: 'center' }}>
          {src ? (
            <img
              src={src}
              alt={value.alt || ''}
              style={{ width: '100%', borderRadius: '8px', objectFit: 'contain' }}
            />
          ) : null}
          {value.caption ? (
            <figcaption style={{ marginTop: '0.75rem', color: '#666', fontSize: '0.925rem' }}>
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      )
    },
  },
}
