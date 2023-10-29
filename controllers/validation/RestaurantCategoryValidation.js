const { check } = require('express-validator')
const { RestaurantCategory } = require('../../models')
// const { Op } = require('sequelize')

const checkRestaurantCategoryNotRepeated = async (value, { req }) => {
  try {
    const existingRestaurantCategory = await RestaurantCategory.findOne({
      where: { name: value }
    })

    if (existingRestaurantCategory) {
      throw new Error('Restaurant category cannot repeat')
    } else {
      return Promise.resolve()
    }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

module.exports = {
  create: [
    check('name').exists().isString().isLength({ min: 1, max: 50 }).trim(),
    check('name').custom(async (value, { req }) => {
      await checkRestaurantCategoryNotRepeated(value, { req })
    }).withMessage('Cannot have two restaurant categories with the same name.')

  ]
}
