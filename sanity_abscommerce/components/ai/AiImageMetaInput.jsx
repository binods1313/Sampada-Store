/**
 * Image input with AI alt + caption.
 * Layout: [asset / preview] → Alt → Generate button → Caption
 * Writes via image-level onChange(set({...value, alt, caption})).
 */
import {useCallback, useMemo, useState} from 'react'
import {set, useClient, useFormValue} from 'sanity'
import {
  Button,
  Card,
  Flex,
  Stack,
  Text,
  TextInput,
  Spinner,
  Box,
} from '@sanity/ui'
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

/** Context from common document shapes */
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

export function AiImageMetaInput(props) {
  const {value, onChange, renderDefault, schemaType} = props
  const client = useClient({apiVersion: '2024-05-18'})
  const ctx = useDocContext()

  const hasAsset = Boolean(value?.asset?._ref)
  const hasAltField = useMemo(
    () => (schemaType?.fields || []).some((f) => f.name === 'alt'),
    [schemaType]
  )
  const hasCaptionField = useMemo(
    () => (schemaType?.fields || []).some((f) => f.name === 'caption'),
    [schemaType]
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [okMsg, setOkMsg] = useState(null)

  const patchImage = useCallback(
    (partial) => {
      onChange(
        set({
          ...(value && typeof value === 'object' ? value : {}),
          _type: value?._type || 'image',
          ...partial,
        })
      )
    },
    [value, onChange]
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
      if (value?.asset?._ref) {
        try {
          const asset = await client.getDocument(value.asset._ref)
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
      console.warn('[AiImageMetaInput] API failed, local fallback', err)
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
      const partial = {}
      if (hasAltField) partial.alt = alt
      if (hasCaptionField) partial.caption = caption
      // If schema only has alt, still set alt
      if (!hasAltField && !hasCaptionField) {
        partial.alt = alt
        partial.caption = caption
      }
      patchImage(partial)
      setOkMsg(
        source === 'local'
          ? 'Filled from document data — edit anytime.'
          : 'Generated — edit anytime.'
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not write fields')
    } finally {
      setLoading(false)
    }
  }, [client, ctx, value, hasAsset, hasAltField, hasCaptionField, patchImage])

  // Schema without alt/caption fields so default UI = asset only; we draw fields ourselves
  const assetOnlyProps = useMemo(() => {
    if (!schemaType) return props
    return {
      ...props,
      schemaType: {
        ...schemaType,
        fields: [],
      },
    }
  }, [props, schemaType])

  const showMeta = hasAltField || hasCaptionField

  return (
    <Stack space={4}>
      {/* Asset / hotspot / upload only */}
      {renderDefault(assetOnlyProps)}

      {showMeta && (
        <Stack space={4}>
          {hasAltField && (
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Alt Text
              </Text>
              <Text size={1} muted>
                Important for accessibility and SEO
              </Text>
              <TextInput
                fontSize={2}
                padding={3}
                value={value?.alt || ''}
                onChange={(e) => patchImage({alt: e.currentTarget.value})}
                placeholder="Describe the image for screen readers"
              />
            </Stack>
          )}

          <Card padding={3} radius={2} border tone="transparent">
            <Stack space={3}>
              <Text size={1} muted>
                Generate alt{hasCaptionField ? ' & caption' : ''} from document
                data and this image. Edit after if you want.
              </Text>
              <Flex gap={2} align="center">
                <Button
                  icon={loading ? undefined : SparklesIcon}
                  text={
                    loading
                      ? 'Generating…'
                      : hasCaptionField
                        ? 'Generate alt & caption'
                        : 'Generate alt text'
                  }
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

          {hasCaptionField && (
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Caption
              </Text>
              <Text size={1} muted>
                Optional caption shown with the image
              </Text>
              <TextInput
                fontSize={2}
                padding={3}
                value={value?.caption || ''}
                onChange={(e) => patchImage({caption: e.currentTarget.value})}
                placeholder="Short caption"
              />
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  )
}

/** @deprecated use AiImageMetaInput */
export const ProductImageMetaInput = AiImageMetaInput
export const ProductImageAltField = AiImageMetaInput
