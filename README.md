# Uppy HEIC Converter

<img src="https://uppy.io/images/logos/uppy-dog-head-arrow.svg" width="120" alt="Uppy logo: a superman puppy in a pink suit" align="right">

A plugin for [Uppy](https://github.com/transloadit/uppy), that converts HEIC to JPEG before upload.

UppyHEICPlugin uses [heic-convert](https://github.com/catdad-experiments/heic-convert).

:warning: This is not an official Uppy plugin, so no support is offered for it. Please use at your own risk.

Uppy is being developed by the folks at [Transloadit](https://transloadit.com), a versatile file encoding service.

## Example

```js
import Uppy from '@uppy/core'
import UppyHEICPlugin from 'uppy-heic'

const uppy = Uppy()
uppy.use(UppyHEICPlugin)
```

## Installation

```bash
pnpm add uppy-heic
```
