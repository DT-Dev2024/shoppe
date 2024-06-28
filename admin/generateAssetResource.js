console.log('Generating...')
var fs = require('fs')
var Hjson = require('hjson')
console.log('hello');
function genStringResource() {
  try {
    const data = fs.readFileSync('./src/component/assets/i18n/vi/translation.json', 'utf8')
    const json = Hjson.parse(data.replace('export default', '').replace(';', ''))
    const stringName = Object.keys(json)
    fs.writeFileSync(
      './src/component/assets/i18n/index.ts',
      `import I18n from './translation'
function strings(){
    return{${stringName.map((string, index) => {
        var path = ''
        if (typeof json[string] === 'string') {
          path = `
    ${string}: I18n.t('${string}')`
        } else {
          var keys = Object.keys(json[string])
          path = keys
            .map((val) => {
              return `
    ${string}_${val}: I18n.t('${string}.${val}')`
            })
            .join(',')
        }
        return path
      })}
}}
export default strings
        `
    )
    console.log(`============== Linked ${stringName.length} string ==============`)
  } catch (err) {
    console.error(err)
  }
}

function genImageResource() {
  fs.readdir('./src/component/assets/images', function (err, fileName) {
    if (err) {
      console.log('==========', err)
      return
    }
    fs.writeFileSync(
      './src/component/assets/images/index.ts',
      `const images = {${fileName.map((iconName) => {
        // eslint-disable-next-line no-undef
        path = `
  ${iconName.split('.')[0]}: require('./${iconName}')`
        // eslint-disable-next-line no-undef
        return path
      })},
}
export default images`,
      { encoding: 'utf8', flag: 'w' }
    )
    console.log(`============== Linked ${fileName.length} images ==============`)
  })
}

genImageResource()
genStringResource()
