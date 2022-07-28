const term = require('terminal-kit').terminal
const fs = require('fs-extra')
const replace = require('replace-in-file')
const { terminate, cancelKeys, input } = require('../helpers/helpers')

// const updateFile = async (name, oldName, newName, newPath) => {
//   const newFilePath = `${newPath}/${name.replace(oldName, newName)}`
//   await fs.rename(`${newPath}/${name}`, newFilePath)
//   return await replace({
//     files: newFilePath,
//     from: new RegExp(oldName, 'g'),
//     to: newName
//   })
// }

;(async () => {
  try {
    cancelKeys()

    const sectionFiles = await fs.readdir('sections')
    term.cyan('Section folder to clone:')
    const selectedOption = await term.gridMenu(sectionFiles.map(file => file.split('.')[0])).promise

    const sectionToCloneName = selectedOption.selectedText
    const newSectionName = await input('\nNew Section Filename')

    console.log(sectionToCloneName)
    console.log(newSectionName)

    await Promise.allSettled([
      'sections/SECTION_NAME.liquid',
      'assets/SECTION_NAME.css',
      'assets/SECTION_NAME.js'
    ].map(async (path) => {
      console.log(path)
    }))

    // const oldPath = `sections/${existingFolder}`
    // const newPath = `sections/${newSectionName}`

    // const exists = await fs.pathExists(newPath)
    // if (exists) { throw Error(`${newSectionName} already exists`) }

    // const verifyInput = await input(`\nCreate ${newSectionName} section from ${existingFolder}? (y/n)`)
    // const cloneGo = verifyInput.toLowerCase()
    // if (cloneGo !== 'yes' && cloneGo !== 'y') {
    //   term.red('\nCanceled')
    //   return terminate()
    // }

    // await fs.copy(oldPath, newPath)
    // const files = await fs.readdir(newPath)
    // await Promise.all(files.map(file => updateFile(file, existingFolder, newSectionName, newPath)))

    // term.green(`\nSuccess! ${existingFolder} has been cloned to ${newSectionName}.`)
    return terminate()
  } catch (error) {
    term.red(`\n${error}`)
    return terminate(1)
  }
})()
