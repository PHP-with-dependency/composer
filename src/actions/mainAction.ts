import * as cache from '../cache'
import * as composer from '../composer'
import * as utils from '../utils'
import {getInput, setFailed} from '@actions/core'

export async function mainAction(): Promise<void> {
  try {
    const composerOptions = getInput('composer-options')
    const inputDependencyVersions = getInput('dependency-versions')

    const composerCacheDir = await utils.getComposerCacheDir()
    const composerWorkingDir = utils.getComposerWorkingDir(composerOptions)
    const cleanedDependencyVersions = utils.getDependencyVersions(
      inputDependencyVersions
    )
    const composerCacheKeys = await utils.getCacheKeys(
      cleanedDependencyVersions,
      composerOptions,
      composerWorkingDir
    )

    await cache.cache(
      cache.restoreFactory(),
      [composerCacheDir],
      composerCacheKeys.key,
      composerCacheKeys.restoreKeys
    )
    await composer.install(cleanedDependencyVersions, composerOptions)
  } catch (error) {
    setFailed(error.message)
  }
}
