import {ServerConfig, enhance} from './config'
import {nextStart} from './next-utils'
import {build} from './build'
import {hashElement} from 'folder-hash'
import {readFile, writeFile} from 'fs-extra'

const hashStore = './.blitz/caches/last-build'

async function getInputArtefactsHash() {
  const options = {
    algo: 'md5',
    folders: {exclude: ['node_modules', '.blitz', 'cypress', '.next']},
  }
  const tree = await hashElement('.', options)
  return tree.hash
}

async function alreadyBuilt() {
  try {
    const buffer = await readFile(hashStore)
    const hash = await getInputArtefactsHash()
    const read = buffer.toString().replace('\n', '')
    return read === hash
  } catch (err) {
    return false
  }
}

async function saveBuild() {
  const hash = await getInputArtefactsHash()
  await writeFile(hashStore, hash)
}

export async function prod(config: ServerConfig) {
  const {rootFolder, nextBin} = await enhance(config)
  if (!(await alreadyBuilt())) {
    await build(config)
    await saveBuild()
  }

  await nextStart(nextBin, rootFolder, config)
}
