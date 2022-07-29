const term = require('terminal-kit').terminal
const fs = require('fs-extra')
const replace = require('replace-in-file')
const { terminate, cancelKeys, input } = require('../helpers/helpers')

// const generateFile = async (fileData, newPath, sectionFilename, sectionTitle, oldFilename) => {
//   const newFilePath = `${newPath}/${fileData.name.replace(oldFilename, sectionFilename)}`
//   await fs.writeFileSync(newFilePath, rawData.data)

//   return await replace({
//     files: newFilePath,
//     from: [new RegExp(oldFilename, 'g'), /SECTION_TITLE/g],
//     to: [sectionFilename, sectionTitle]
//   })
// }

;(async () => {
  try {
    cancelKeys()
    const sectionFilename = await input('\nInput new section filename')
    const sectionTitle = await input('\nInput new section title')

    console.log(sectionFilename, sectionTitle)
    // const newPath = `/sections/${sectionFilename}`
    // const exists = await fs.pathExists(newPath)
    // if (exists) { throw Error(`${sectionFilename} already exists`) }
    //

    // await fs.mkdirSync(newPath, { recursive: true })
    // await Promise.all(dirResponse.data.map((fileData) => generateFile(fileData, newPath, sectionFilename, sectionTitle, templateSelectedOption.selectedText)))
    // await findDependencies(dirResponse.data.find((fileData) => fileData.name === '_.json'))

    term.green(`\nSuccess! <${sectionFilename}> has been created.`)
    return terminate()
  } catch (error) {
    term.red(`\n${error}`)
    return terminate(1)
  }
})()
