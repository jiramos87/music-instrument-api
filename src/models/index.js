import fs from 'fs'
import { DataTypes, Op } from 'sequelize'

import sequelize from '../config/database.config'
import { capitalizeSentence } from '../utils/string_util'

const modelFiles = fs.readdirSync(__dirname).filter((name) => (
  ['.model.', '_model.'].some((suffix) => name.includes(suffix))
))

const models = {}

modelFiles.forEach((nameFile) => {
  const cleanedName = nameFile.replace(/(\.|-|_)model\.js/, '')
  const modelName = capitalizeSentence(cleanedName, '_', '')

  models[modelName] = require(`./${nameFile}`).default(sequelize, DataTypes)
})

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

export { sequelize, Op }
export default models
