import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '7lh35oho',
    dataset: 'production',
    apiVersion: '2024-05-18', // Use a specific API version
       },
  studioHost: 'binod-tech-ventures',
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
});
