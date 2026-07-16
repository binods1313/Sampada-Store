/**
 * String/text field with "Generate with AI" for titles, excerpts, etc.
 */
import {useCallback, useState} from 'react'
import {set, useClient, useFormValue} from 'sanity'
import {Button, Card, Flex, Stack, Text, TextArea, TextInput, Spinner} from '@sanity/ui'
import {SparklesIcon} from '@sanity/icons'

const META_ENDPOINT =
  (typeof process !== 'undefined' &&
    process.env?.SANITY_STUDIO_IMAGE_META_URL) ||
  'https://sampadaoriginals.in/api/ai/generate-image-meta'

const TEXT_ENDPOINT =
  (typeof process !== 'undefined' &&
    process.env?.SANITY_STUDIO_TEXT_FILL_URL) ||
  'https://sampadaoriginals.in/api/ai/generate-field-text'

function localText({fieldName, productName, title, details}) {
  const base = (productName || title || 'Sampada').trim()
  const name = fieldName || 'text'
  if (name === 'title' || name === 'name') return base
  if (name === 'excerpt' || name === 'metaDescription') {
    return `${base} — premium heritage fashion from Sampada Originals.`.slice(0, 160)
  }
  if (name === 'specialty') {
    return `Signature style and craftsmanship in ${base}.`
  }
  return (details || `${base} from Sampada Originals`).slice(0, 500)
}

export function AiTextFieldInput(props) {
  const {value, onChange, schemaType, elementProps} = props
  const fieldName = schemaType?.name
  const isText = schemaType?.jsonType === 'text' || schemaType?.rows > 0
  const rows = schemaType?.rows || 3

  const productName = useFormValue(['name'])
  const title = useFormValue(['title'])
  const details = useFormValue(['details'])
  const excerpt = useFormValue(['excerpt'])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generate = useCallback(async () => {
    setLoading(true)
    setError(null)
    const context = {
      fieldName,
      fieldTitle: schemaType?.title || fieldName,
      productName: productName || '',
      title: title || '',
      details: details || excerpt || '',
      currentValue: value || '',
    }

    let text = ''
    try {
      const res = await fetch(TEXT_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(context),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.text) {
        text = String(data.text).trim()
      } else {
        // Fallback: try meta endpoint style or local
        throw new Error(data.error || 'API error')
      }
    } catch {
      text = localText(context)
    }

    if (text) {
      onChange(set(text))
    } else {
      setError('Could not generate text')
    }
    setLoading(false)
  }, [fieldName, schemaType?.title, productName, title, details, excerpt, value, onChange])

  const shared = {
    value: value || '',
    onChange: (e) => onChange(set(e.currentTarget.value)),
    disabled: loading,
    ...elementProps,
  }

  return (
    <Stack space={3}>
      {isText || rows > 1 ? (
        <TextArea fontSize={2} padding={3} rows={rows} {...shared} />
      ) : (
        <TextInput fontSize={2} padding={3} {...shared} />
      )}
      <Flex gap={2} align="center">
        <Button
          icon={loading ? undefined : SparklesIcon}
          text={loading ? 'Generating…' : 'Generate with AI'}
          mode="ghost"
          tone="primary"
          fontSize={1}
          padding={3}
          disabled={loading}
          onClick={generate}
        />
        {loading && <Spinner muted />}
      </Flex>
      {error && (
        <Card padding={2} radius={2} tone="critical" border>
          <Text size={1}>{error}</Text>
        </Card>
      )}
    </Stack>
  )
}
