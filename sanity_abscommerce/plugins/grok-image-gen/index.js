// plugins/grok-image-gen — custom Sanity v5-compatible image asset source for Grok
import {createElement} from 'react'
import {definePlugin} from 'sanity'
import {SparklesIcon} from '@sanity/icons'
import {GrokImageAssetSource} from './GrokImageAssetSource.jsx'

const DEFAULT_ENDPOINT = 'https://sampadaoriginals.in/api/generate-image'

/**
 * Registers "Generate Image" in every image field's Select / asset source menu.
 *
 * @param {{ apiEndpoint?: string }} [options]
 */
export const grokImageGen = definePlugin((options = {}) => {
  const apiEndpoint = (options.apiEndpoint || DEFAULT_ENDPOINT).toString()

  return {
    name: 'sampada-grok-image-gen',
    form: {
      image: {
        assetSources: (prev) => [
          ...prev,
          {
            name: 'sampada-grok-image-gen',
            title: 'Generate Image',
            icon: SparklesIcon,
            component: (props) =>
              createElement(GrokImageAssetSource, {
                ...props,
                apiEndpoint,
              }),
          },
        ],
      },
    },
  }
})
