const args = require('yargs-parser')(process.argv.slice(2))
const fs = require('fs-extra')
const chalk = require('chalk')
const semver = require('semver')
const path = require('path')
const { prompt } = require('enquirer')
const execa = require('execa')

const currentVersion = require('../package.json').version

const skipTests = args.skipTests
const skipBuild = args.skipBuild

const preId =
  args.preid || (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0])

const packages = fs
  .readdirSync(path.resolve(__dirname, '../packages'))
  .filter((p) => !p.startsWith('.'))

const versionIncrements = [
  'patch',
  'minor',
  'major',
  ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
]

const increaseVersion = (i) => semver.inc(currentVersion, i, preId)
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })
const getPkgRoot = (pkg) => path.resolve(__dirname, '../packages/' + pkg)
const step = (msg) => console.log(chalk.cyan(msg))

async function main() {
  let targetVersion = args._[0]

  if (!targetVersion) {
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements.map((i) => `${i} (${increaseVersion(i)})`).concat(['custom']),
    })

    if (release === 'custom') {
      targetVersion = (
        await prompt({
          type: 'input',
          name: 'version',
          message: 'Input custom version',
          initial: currentVersion,
        })
      ).version
    } else {
      targetVersion = release.match(/\((.*)\)/)[1]
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  })

  if (!yes) {
    return
  }

  step('\nRunning tests...')
  if (!skipTests) {
    await run('jest', ['--clearCache'])
    await run('yarn', ['test', '--bail'])
  } else {
    console.log(`(skipped)`)
  }

  step('\nUpdating packages version...')
  updateVersions(targetVersion)

  step('\nBuilding all packages...')
  if (!skipBuild) {
    await run('yarn', ['build:packages'])
  } else {
    console.log(`(skipped)`)
  }

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await run('git', ['add', '-A'])
    await run('git', ['commit', '-m', `release: v${targetVersion}`])
  } else {
    console.log('No changes to commit.')
  }

  step('\nPublishing packages...')

  const { yes: publish } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Publish v${targetVersion}. Confirm?`,
  })
  if (publish) {
    await run('yarn', ['publish:packages'])
  } else {
    console.log('(skipped)')
  }
}

function updateVersions(version) {
  updatePackage(path.resolve(__dirname, '..'), version)
  packages.forEach((p) => updatePackage(getPkgRoot(p), version))
}

function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

main().catch((err) => {
  console.error(err)
})
