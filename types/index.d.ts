import type { PluginOptions, BasePlugin } from '@uppy/core'

export interface ImageObject {
  data: File,
  preview: string
}

declare class UppyHEICPlugin extends BasePlugin<PluginOptions> {}

export default UppyHEICPlugin
