/* eslint-disable import/first */

const nextUtilsMock = {
  nextBuild: jest.fn().mockReturnValue(Promise.resolve()),
  nextStart: jest.fn().mockReturnValue(Promise.resolve()),
}

// Quieten reporter
jest.doMock('../src/reporter', () => ({
  reporter: {copy: jest.fn(), remove: jest.fn()},
}))

// Assume next works
jest.doMock('../src/next-utils', () => nextUtilsMock)

// Mock where the next bin is
jest.doMock('../src/resolve-bin-async', () => ({
  resolveBinAsync: jest.fn().mockReturnValue(Promise.resolve('')),
}))

// Import with mocks applied
import {prod} from '../src/prod'
// import {directoryTree} from './utils/tree-utils'
import mockfs from 'mock-fs'
import {resolve} from 'path'

describe('Prod command', () => {
  const rootFolder = resolve('build')
  const buildFolder = resolve(rootFolder, '.blitz-build')
  const devFolder = resolve(rootFolder, '.blitz')

  beforeEach(async () => {
    mockfs({
      build: {
        '.blitz-build': {
          'last-build': 'k1qYFwjzdstNfempUoTbug==',
        },
        '.now': '',
        one: '',
        two: '',
      },
    })
    jest.clearAllMocks()
    await prod({
      rootFolder,
      buildFolder,
      devFolder,
      writeManifestFile: false,
      port: 3000,
      hostname: 'localhost',
    })
  })

  afterEach(() => {
    mockfs.restore()
  })

  it('should not run build when the output ', async () => {
    // const tree = directoryTree(rootFolder)
  })
})
