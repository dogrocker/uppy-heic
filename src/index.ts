import { BasePlugin, DefaultPluginOptions, Uppy, UppyFile } from '@uppy/core'
import convert from 'heic-convert'

interface ImageObject {
  data: File,
  preview: string
}

export default class UppyHEICPlugin extends BasePlugin {
  constructor (uppy: Uppy, opts?: DefaultPluginOptions | undefined) {
    super(uppy, opts)
    this.id = opts?.id ?? 'UppyHEICPlugin'
    this.type = 'modifier'
    this.onFileAdded = this.onFileAdded.bind(this)
  }

  toBase64(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  async conversion(currentFile: UppyFile): Promise<ImageObject> {
    let base64String = await this.toBase64(currentFile.data)
    base64String = base64String.split(';base64,')[1]
    const inputBuffer = Buffer.from(base64String, 'base64')
    const outputBuffer = await convert({
      buffer: inputBuffer, // the HEIC file buffer
      format: 'JPEG', // output format
      quality: 0.6, // the jpeg compression quality, between 0 and 1
    })

    const blob = new Blob([outputBuffer])
    const JpegImage: ImageObject = {} as ImageObject
    JpegImage.preview = URL.createObjectURL(blob)
    JpegImage.data = new File([blob], `${currentFile.name.split('.').shift()}.jpg`, {
      type: 'image/jpeg',
    })
    return JpegImage
  }

  async onFileAdded(file: UppyFile) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (
      fileExtension === 'heic' || fileExtension === 'heif'
    ) {
      try {
        const JpegImage = await this.conversion(file)
        const uploadedFile = {
          data: JpegImage.data,
          extension: 'JPEG',
          type: 'image/jpeg',
          preview: JpegImage.preview
        }
        this.uppy.setFileState(file.id, uploadedFile)
      } catch(error) {
        this.uppy.log(
          `HEIC Image convert to JPEG Failed ${file.id}:`,
          'warning'
        )
        if (typeof error === 'string') {
          this.uppy.log(error, 'warning')
        }
        else if (error instanceof Error) {
          this.uppy.log(error.message, 'warning')
        }
      }
    }
  }

  install() {
    this.uppy.on('file-added', this.onFileAdded)
  }

  uninstall() {
    this.uppy.off('file-added', this.onFileAdded)
  }
}
