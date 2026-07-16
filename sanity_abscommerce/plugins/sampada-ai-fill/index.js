/**
 * Global Studio AI fill plugin:
 * - Any `image` type that has `alt` (and optional `caption`) fields gets AiImageMetaInput
 * - String/text fields with options.aiFill: true get Generate with AI
 */
import {definePlugin} from 'sanity'
import {createElement} from 'react'
import {AiImageMetaInput} from '../../components/ai/AiImageMetaInput.jsx'
import {AiTextFieldInput} from '../../components/ai/AiTextFieldInput.jsx'

function hasImageMetaFields(schemaType) {
  if (!schemaType || schemaType.name !== 'image') return false
  const fields = schemaType.fields || []
  return fields.some((f) => f.name === 'alt')
}

function wantsAiText(schemaType) {
  if (!schemaType) return false
  if (schemaType.options?.aiFill === true) return true
  // Auto-enable for common manual text fields (not every string — too noisy)
  const n = schemaType.name
  const auto = new Set([
    'title',
    'excerpt',
    'specialty',
    'metaDescription',
    'seoTitle',
    'seoDescription',
    'department',
    'location',
  ])
  // Only leaf string/text fields with these names (avoid wrapping every string)
  const json = schemaType.jsonType
  if (json !== 'string' && schemaType.type !== 'text' && !schemaType.rows) {
    return false
  }
  return auto.has(n)
}

export const sampadaAiFill = definePlugin({
  name: 'sampada-ai-fill',
  form: {
    components: {
      input: (props) => {
        try {
          if (hasImageMetaFields(props.schemaType)) {
            return createElement(AiImageMetaInput, props)
          }
          if (wantsAiText(props.schemaType)) {
            return createElement(AiTextFieldInput, props)
          }
        } catch (e) {
          console.error('[sampada-ai-fill] input wrapper error', e)
        }
        return props.renderDefault(props)
      },
    },
  },
})
