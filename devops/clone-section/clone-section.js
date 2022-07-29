const term = require('terminal-kit').terminal
const fs = require('fs-extra')
const replace = require('replace-in-file')
const { terminate, cancelKeys, input } = require('../helpers/helpers')

const cloneFile = async (path, sectionToCloneName, newSectionName) => {
  const oldPath = path.replace('SECTION_NAME', sectionToCloneName)
  const newPath = path.replace('SECTION_NAME', newSectionName)

  const oldPathCheck = await fs.pathExists(oldPath)
  if (!oldPathCheck) { throw Error(`<${oldPath}> does not exist`) }

  const newPathCheck = await fs.pathExists(newPath)
  if (newPathCheck) { throw Error(`<${newPath}> already exists`) }

  await fs.copy(oldPath, newPath)
  await replace({
    files: newPath,
    from: new RegExp(sectionToCloneName, 'g'),
    to: newSectionName
  })

  return [oldPath, newPath]
}

;(async () => {
  try {
    cancelKeys()

    const sectionFiles = await fs.readdir('sections')
    term.cyan('Section folder to clone:')
    const selectedOption = await term.gridMenu(
      sectionFiles.map(file => file.split('.')[0])
    ).promise

    const sectionToCloneName = selectedOption.selectedText
    const newSectionName = await input('\nNew Section Filename')

    const verifyInput = await input(`\nCreate ${newSectionName} section from ${sectionToCloneName}? (y/n)`)
    const cloneGo = verifyInput.toLowerCase()
    if (cloneGo !== 'yes' && cloneGo !== 'y') {
      term.red('\nCanceled')
      return terminate()
    }

    const cloneRes = await Promise.allSettled([
      'sections/SECTION_NAME.liquid',
      'assets/SECTION_NAME.css',
      'assets/SECTION_NAME.js'
    ].map(async (path) => cloneFile(path, sectionToCloneName, newSectionName)))

    const message = cloneRes
      .filter((res) => res.status === 'fulfilled')
      .map((res) => `<${res.value[1]}> cloned from <${res.value[0]}>`)
      .join('\n')

    term.green(`\nSuccess!\n${message}`)

    return terminate()
  } catch (error) {
    term.red(`\n${error}`)
    return terminate(1)
  }
})()
