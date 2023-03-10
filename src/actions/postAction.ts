import * as cache from '../cache'
import * as utils from '../utils'
import {getInput, info} from '@actions/core'

export async function postAction(): Promise<void> {
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
      cache.saveFactory(),
      [composerCacheDir],
      composerCacheKeys.key,
      composerCacheKeys.restoreKeys
    )
  } catch (error) {
    info(`[warning] ${error.message}`)
  }
}
