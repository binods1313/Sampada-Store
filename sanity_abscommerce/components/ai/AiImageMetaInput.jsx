/**
 * Injects "Generate alt & caption" BETWEEN the Alt and Caption fields
 * (as a field wrapper on `alt` only — no second set of inputs).
 *
 * Writes via:
 * 1) alt field onChange (scoped) for alt
 * 2) parent image object set for both alt + caption (reliable form update)
 */
import {useCallback, useState} from 'react'
import {
  PatchEvent,
  set,
  useClient,
  useFormCallbacks,
  useFormValue,
} from 'sanity'
import {Button, Card, Flex, Stack, Text, Spinner} from '@sanity/ui'
import {SparklesIcon} from '@sanity/icons'

const META_ENDPOINT =
  (typeof process !== 'undefined' &&
    process.env?.SANITY_STUDIO_IMAGE_META_URL) ||
  'https://sampadaoriginals.in/api/ai/generate-image-meta'

function localFallback({productName, category, details, title}) {
  const name = (productName || title || 'Image').trim()
  const cat = (category || '').trim()
  const alt = (cat
    ? `${name} — ${cat} from Sampada Originals`
    : `${name} from Sampada Originals`
  ).slice(0, 125)
  const detailSnippet = String(details || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120)
  const caption = (detailSnippet
    ? `${name}. ${detailSnippet}${detailSnippet.length >= 120 ? '…' : ''}`
    : `${name} — Sampada Originals`
  ).slice(0, 200)
  return {alt, caption, source: 'local'}
}

function useDocContext() {
  const name = useFormValue(['name'])
  const title = useFormValue(['title'])
  const categoryRef = useFormValue(['category'])
  const details = useFormValue(['details'])
  const specialty = useFormValue(['specialty'])
  const excerpt = useFormValue(['excerpt'])
  const description = useFormValue(['description'])
  const price = useFormValue(['price'])
  return {name, title, categoryRef, details, specialty, excerpt, description, price}
}

function lastPathSeg(path) {
  if (!Array.isArray(path) || !path.length) return null
  return path[path.length - 1]
}

/**
 * components.field wrapper for the `alt` string field only.
 * Renders: default Alt field → Generate button  (Caption stays the next schema field once)
 */
export function AiAltFieldWithGenerate(props) {
  const {renderDefault, path, inputProps} = props
  const {onChange: onFormChange} = useFormCallbacks()
  const client = useClient({apiVersion: '2024-05-18'})
  const ctx = useDocContext()

  const imagePath = Array.isArray(path) && path.length > 1 ? path.slice(0, -1) : []
  const imageValue = useFormValue(imagePath.length ? imagePath : ['__none__'])
  const hasAsset = Boolean(imageValue?.asset?._ref)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [okMsg, setOkMsg] = useState(null)

  const applyAltCaption = useCallback(
    (alt, caption) => {
      const nextAlt = String(alt || '').trim()
      const nextCaption = String(caption || '').trim()

      // 1) Update alt through the field's own input onChange (always updates this input)
      if (inputProps?.onChange && nextAlt) {
        inputProps.onChange(set(nextAlt))
      }

      // 2) Update whole parent image object so caption + alt stick in form state
      if (imagePath.length > 0) {
        const base =
          imageValue && typeof imageValue === 'object' ? imageValue : {_type: 'image'}
        const nextImage = {
          ...base,
          _type: base._type || 'image',
          alt: nextAlt,
          caption: nextCaption,
        }
        onFormChange(PatchEvent.from(set(nextImage, imagePath)))
      } else if (path && nextAlt) {
        onFormChange(PatchEvent.from(set(nextAlt, path)))
        if (nextCaption) {
          // best-effort caption if we can only resolve path
          const capPath = [...(Array.isArray(path) ? path.slice(0, -1) : []), 'caption']
          onFormChange(PatchEvent.from(set(nextCaption, capPath)))
        }
      }
    },
    [inputProps, imagePath, imageValue, onFormChange, path]
  )

  const generateMeta = useCallback(async () => {
    setLoading(true)
    setError(null)
    setOkMsg(null)

    let categoryName = ''
    let imageUrl = ''
    try {
      if (ctx.categoryRef?._ref) {
        try {
          const cat = await client.getDocument(ctx.categoryRef._ref)
          categoryName = cat?.name || cat?.title || ''
        } catch {
          /* ignore */
        }
      }
      if (imageValue?.asset?._ref) {
        try {
          const asset = await client.getDocument(imageValue.asset._ref)
          imageUrl = asset?.url || ''
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
    }

    const detailsText = [
      ctx.details,
      ctx.specialty,
      typeof ctx.description === 'string' ? ctx.description : '',
      ctx.excerpt,
    ]
      .filter(Boolean)
      .join('\n')

    const context = {
      productName: ctx.name || ctx.title || '',
      category: categoryName,
      details: detailsText,
      price: ctx.price,
      imageUrl: imageUrl || undefined,
    }

    let alt = ''
    let caption = ''
    let source = 'local'

    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 45000)
      const res = await fetch(META_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(context),
        signal: controller.signal,
      })
      clearTimeout(timer)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `API error ${res.status}`)
      if (!data.alt && !data.caption) throw new Error('No alt/caption returned')
      alt = String(data.alt || '').trim()
      caption = String(data.caption || '').trim()
      source = data.source || 'xai'
    } catch (err) {
      console.warn('[AiAltFieldWithGenerate] API failed, local fallback', err)
      const fb = localFallback(context)
      alt = fb.alt
      caption = fb.caption
      source = 'local'
      if (!context.productName && !hasAsset) {
        setError(err instanceof Error ? err.message : 'Generation failed')
        setLoading(false)
        return
      }
    }

    try {
      applyAltCaption(alt, caption)
      setOkMsg(
        source === 'local'
          ? 'Filled from document data — edit anytime.'
          : 'Alt text & caption generated — edit anytime.'
      )
    } catch (e) {
      console.error('[AiAltFieldWithGenerate] write failed', e)
      setError(e instanceof Error ? e.message : 'Could not write fields')
    } finally {
      setLoading(false)
    }
  }, [client, ctx, imageValue, hasAsset, applyAltCaption])

  // Only inject for the `alt` field path
  const seg = lastPathSeg(path)
  if (seg !== 'alt') {
    return renderDefault(props)
  }

  return (
    <Stack space={3}>
      {renderDefault(props)}

      <Card padding={3} radius={2} border tone="transparent">
        <Stack space={3}>
          <Text size={1} muted>
            Generate alt text and caption (caption is the field below). Edit after
            if you want.
          </Text>
          <Flex gap={2} align="center" wrap="wrap">
            <Button
              icon={loading ? undefined : SparklesIcon}
              text={loading ? 'Generating…' : 'Generate alt & caption'}
              tone="primary"
              fontSize={1}
              padding={3}
              disabled={loading || (!ctx.name && !ctx.title && !hasAsset)}
              onClick={generateMeta}
            />
            {loading && <Spinner muted />}
          </Flex>
          {error && (
            <Card padding={2} radius={2} tone="critical" border>
              <Text size={1}>{error}</Text>
            </Card>
          )}
          {okMsg && !error && (
            <Card padding={2} radius={2} tone="positive" border>
              <Text size={1}>{okMsg}</Text>
            </Card>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}

/** @deprecated — image-level wrapper removed (caused duplicate fields) */
export function AiImageMetaInput(props) {
  return props.renderDefault(props)
}

export const ProductImageMetaInput = AiImageMetaInput
export const ProductImageAltField = AiAltFieldWithGenerate
