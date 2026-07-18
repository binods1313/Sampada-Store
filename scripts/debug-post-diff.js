/**
 * One-off: dump Portable Text body structure for two blog posts.
 * Usage: node scripts/debug-post-diff.js
 */
const { createClient } = require('@sanity/client')
const path = require('path')
const fs = require('fs')

// Load env without requiring dotenv if missing
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const text = fs.readFileSync(filePath, 'utf8')
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!m) continue
    let val = m[2].trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!process.env[m[1]]) process.env[m[1]] = val
  }
}

loadEnvFile(path.join(process.cwd(), '.env.local'))
loadEnvFile(path.join(process.cwd(), '.env'))

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7lh35oho',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  token: process.env.SANITY_PUBLISH_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

const SLUGS = [
  'sound-vision-and-beyond-what-next-gen-tech-feels-like',
  'where-threads-remember-the-story-of-sampada-originals',
]

function textPreview(block) {
  if (!block || block._type !== 'block') return null
  const parts = (block.children || []).map((c) => {
    if (typeof c?.text === 'string') return c.text
    return ''
  })
  const full = parts.join('')
  return full.slice(0, 20)
}

function describeBlock(block, index) {
  const base = {
    index,
    _key: block?._key ?? null,
    _type: block?._type ?? null,
    style: block?._type === 'block' ? block.style ?? null : null,
    listItem: block?._type === 'block' ? block.listItem ?? null : null,
    level: block?._type === 'block' ? block.level ?? null : null,
    markDefsCount: Array.isArray(block?.markDefs) ? block.markDefs.length : null,
    childrenCount: Array.isArray(block?.children) ? block.children.length : null,
    childrenKeys: Array.isArray(block?.children)
      ? block.children.map((c) => c?._key ?? null)
      : null,
    childrenTypes: Array.isArray(block?.children)
      ? block.children.map((c) => c?._type ?? null)
      : null,
    textPreview20: textPreview(block),
    assetRef:
      block?._type === 'image'
        ? block?.asset?._ref || block?.asset?._id || null
        : null,
    // Flags that often break PT / React lists
    missingKey: !block?._key,
    emptyKey: block?._key === '',
    missingType: !block?._type,
    unknownType:
      block?._type && !['block', 'image'].includes(block._type)
        ? block._type
        : null,
    childrenMissingKeys: Array.isArray(block?.children)
      ? block.children.filter((c) => !c?._key).length
      : null,
    childrenEmptyText:
      block?._type === 'block'
        ? (block.children || []).every(
            (c) => !c?.text || String(c.text).length === 0
          )
        : null,
  }
  return base
}

function analyzeKeys(body) {
  const keys = (body || []).map((b) => b?._key)
  const seen = new Map()
  const duplicates = []
  keys.forEach((k, i) => {
    if (k == null || k === '') return
    if (seen.has(k)) duplicates.push({ key: k, indices: [seen.get(k), i] })
    else seen.set(k, i)
  })
  return {
    totalBlocks: (body || []).length,
    missingKeys: keys.filter((k) => k == null || k === '').length,
    duplicateKeys: duplicates,
    typeCounts: (body || []).reduce((acc, b) => {
      const t = b?._type || '(none)'
      acc[t] = (acc[t] || 0) + 1
      return acc
    }, {}),
    styleCounts: (body || [])
      .filter((b) => b?._type === 'block')
      .reduce((acc, b) => {
        const s = b?.style || '(none)'
        acc[s] = (acc[s] || 0) + 1
        return acc
      }, {}),
  }
}

async function fetchPost(slug) {
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      _rev,
      _type,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt,
      body
    }`,
    { slug }
  )
  return post
}

async function main() {
  console.log('=== debug-post-diff ===')
  console.log(
    'project',
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7lh35oho',
    'dataset',
    process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  )
  console.log('token?', !!(process.env.SANITY_PUBLISH_TOKEN || process.env.SANITY_API_READ_TOKEN))
  console.log('')

  for (const slug of SLUGS) {
    console.log('='.repeat(80))
    console.log('SLUG:', slug)
    console.log('='.repeat(80))
    try {
      const post = await fetchPost(slug)
      if (!post) {
        console.log('NOT FOUND in Sanity')
        console.log('')
        continue
      }
      console.log(
        JSON.stringify(
          {
            _id: post._id,
            _rev: post._rev,
            title: post.title,
            slug: post.slug,
            publishedAt: post.publishedAt,
            bodyIsArray: Array.isArray(post.body),
            bodyLength: Array.isArray(post.body) ? post.body.length : null,
            bodyTypeof: typeof post.body,
            analysis: analyzeKeys(post.body),
          },
          null,
          2
        )
      )
      console.log('--- BLOCKS ---')
      if (!Array.isArray(post.body)) {
        console.log('body is not an array:', post.body)
      } else {
        post.body.forEach((block, index) => {
          console.log(JSON.stringify(describeBlock(block, index), null, 2))
        })
      }
      console.log('')
    } catch (err) {
      console.log('FETCH ERROR for', slug, err.message)
      console.log(err)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
