/**
 * Field wrapper for product image `alt`.
 * Order: Alt field → Generate button → Caption field (schema order).
 * Writes both alt + caption into the parent image object so the form updates.
 */
import {useCallback, useState} from 'react'
import {PatchEvent, set, useClient, useFormCallbacks, useFormValue} from 'sanity'
import {Button, Card, Flex, Stack, Text, Spinner} from '@sanity/ui'
import {SparklesIcon} from '@sanity/icons'

const META_ENDPOINT =
  (typeof process !== 'undefined' &&
    process.env?.SANITY_STUDIO_IMAGE_META_URL) ||
  'https://sampadaoriginals.in/api/ai/generate-image-meta'

function localFallback({productName, category, details}) {
  const name = (productName || 'Product').trim()
  const cat = (category || '').trim()
  const alt = (cat
    ? `${name} — ${cat} from Sampada Originals`
    : `${name} product image from Sampada Originals`
  ).slice(0, 125)
  const detailSnippet = String(details || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120)
  const caption = (detailSnippet
    ? `${name}. ${detailSnippet}${detailSnippet.length >= 120 ? '…' : ''}`
    : `${name} — premium piece from Sampada Originals. Wear your legacy.`
  ).slice(0, 200)
  return {alt, caption, source: 'local'}
}

/**
 * components.field on image.alt
 */
export function ProductImageAltField(props) {
  const {renderDefault, path, inputProps} = props
  const {onChange: onFormChange} = useFormCallbacks()
  const client = useClient({apiVersion: '2024-05-18'})

  const productName = useFormValue(['name'])
  const categoryRef = useFormValue(['category'])
  const details = useFormValue(['details'])
  const price = useFormValue(['price'])
  const specialty = useFormValue(['specialty'])

  // Parent image object path: ['image', {_key}, 'alt'] → ['image', {_key}]
  const imagePath = Array.isArray(path) && path.length > 0 ? path.slice(0, -1) : []
  const imageValue = useFormValue(imagePath.length ? imagePath : ['_'])
  const hasAsset = Boolean(imageValue?.asset?._ref)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [okMsg, setOkMsg] = useState(null)

  const applyAltCaption = useCallback(
    (alt, caption) => {
      const nextAlt = String(alt || '').trim()
      const nextCaption = String(caption || '').trim()

      // Preferred: set entire parent image object (keeps asset/hotspot/_key)
      if (imagePath.length > 0 && imageValue && typeof imageValue === 'object') {
        const nextImage = {
          ...imageValue,
          _type: imageValue._type || 'image',
          alt: nextAlt,
          caption: nextCaption,
        }
        onFormChange(PatchEvent.from(set(nextImage, imagePath)))
        return true
      }

      // Fallback: set this field (alt) via inputProps + caption path if possible
      if (inputProps?.onChange && nextAlt) {
        inputProps.onChange(set(nextAlt))
      }
      if (imagePath.length > 0 && nextCaption) {
        onFormChange(PatchEvent.from(set(nextCaption, [...imagePath, 'caption'])))
      }
      if (path && nextAlt) {
        onFormChange(PatchEvent.from(set(nextAlt, path)))
      }
      return Boolean(nextAlt || nextCaption)
    },
    [imagePath, imageValue, inputProps, onFormChange, path]
  )

  const generateMeta = useCallback(async () => {
    setLoading(true)
    setError(null)
    setOkMsg(null)

    let categoryName = ''
    let imageUrl = ''

    try {
      if (categoryRef?._ref) {
        try {
          const cat = await client.getDocument(categoryRef._ref)
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

    const context = {
      productName: productName || '',
      category: categoryName,
      details: [details, specialty].filter(Boolean).join('\n'),
      price,
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
      if (!res.ok) {
        throw new Error(data.error || `API error ${res.status}`)
      }
      if (!data.alt && !data.caption) {
        throw new Error('No alt/caption returned')
      }
      alt = String(data.alt || '').trim()
      caption = String(data.caption || '').trim()
      source = data.source || 'xai'
    } catch (err) {
      console.warn('[ProductImageAltField] API failed, using local fallback', err)
      const fb = localFallback(context)
      alt = fb.alt
      caption = fb.caption
      source = 'local'
      if (!productName && !hasAsset) {
        setError(err instanceof Error ? err.message : 'Generation failed')
        setLoading(false)
        return
      }
    }

    try {
      const applied = applyAltCaption(alt, caption)
      if (!applied) {
        setError('Generated text but could not write fields — try typing manually.')
      } else {
        setOkMsg(
          source === 'local'
            ? 'Filled from product data — edit anytime.'
            : 'Alt text & caption generated — edit anytime.'
        )
      }
    } catch (writeErr) {
      console.error('[ProductImageAltField] patch failed', writeErr)
      setError(
        writeErr instanceof Error
          ? writeErr.message
          : 'Could not write alt/caption into the form'
      )
    } finally {
      setLoading(false)
    }
  }, [
    client,
    categoryRef,
    imageValue,
    productName,
    details,
    specialty,
    price,
    hasAsset,
    applyAltCaption,
  ])

  return (
    <Stack space={3}>
      {renderDefault(props)}

      <Card padding={3} radius={2} shadow={1} tone="transparent" border>
        <Stack space={3}>
          <Text size={1} muted>
            Auto-fill alt text and caption from product name, details, and this
            image. You can edit either field after.
          </Text>
          <Flex gap={2} align="center" wrap="wrap">
            <Button
              icon={loading ? undefined : SparklesIcon}
              text={loading ? 'Generating…' : 'Generate alt & caption'}
              tone="primary"
              fontSize={1}
              padding={3}
              disabled={loading || (!productName && !hasAsset)}
              onClick={generateMeta}
            />
            {loading && <Spinner muted />}
          </Flex>
          {!productName && !hasAsset && (
            <Text size={1} muted>
              Add a product name or image first.
            </Text>
          )}
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

export {ProductImageAltField as ProductImageMetaInput}
