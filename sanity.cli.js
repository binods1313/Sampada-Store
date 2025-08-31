
/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({ 
  api: { projectId, dataset },
  // Add this to set the studio host permanently
  studioHost: 'binod-tech-ventures',
  // Add this to disable manifest extraction
  env: {
    SANITY_CLI_EXTRACT_MANIFEST_ENABLED: 'false',
  }
})