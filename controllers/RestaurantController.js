
'use strict'
const models = require('../models')
const Restaurant = models.Restaurant
const Product = models.Product
const RestaurantCategory = models.RestaurantCategory
const ProductCategory = models.ProductCategory
// const Sequelize = require('sequelize')
exports.toggleProductsSorting = async function (req, res) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    restaurant.sortByPrice = !restaurant.sortByPrice
    await restaurant.save()
    res.json(restaurant)
  } catch (err) {
    console.error('Error en toggleProductsSorting:', err)
    res.status(500).send(err)
  }
}
exports.toggleRestaurantMenu = async function (req, res) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    restaurant.menu = !restaurant.menu
    await restaurant.save()
    res.json(restaurant)
  } catch (err) {
    console.error('Error en toggleRestaurantMenu:', err)
    res.status(500).send(err)
  }
}

exports.index = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: ['id', 'name', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'sortByPrice', 'restaurantCategoryId', 'menu'],
        include:
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      },
        order: [[{ model: RestaurantCategory, as: 'restaurantCategory' }, 'name', 'ASC']]
      }
    )
    res.json(restaurants)
  } catch (err) {
    console.error('Error en index user', err)
    res.status(500).send(err)
  }
}

exports.indexOwner = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: ['id', 'name', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'sortByPrice', 'restaurantCategoryId', 'menu'],
        where: { userId: req.user.id }
      })
    res.json(restaurants)
  } catch (err) {
    console.error('Error en index owner', err)
    res.status(500).send(err)
  }
}

exports.create = async function (req, res) {
  const newRestaurant = Restaurant.build(req.body)
  newRestaurant.userId = req.user.id // usuario actualmente autenticado

  if (typeof req.files?.heroImage !== 'undefined') {
    newRestaurant.heroImage = req.files.heroImage[0].destination + '/' + req.files.heroImage[0].filename
  }
  if (typeof req.files?.logo !== 'undefined') {
    newRestaurant.logo = req.files.logo[0].destination + '/' + req.files.logo[0].filename
  }
  try {
    const restaurant = await newRestaurant.save()
    res.json(restaurant)
  } catch (err) {
    console.error('Error en create restaurant', err)
    res.status(500).send(err)
  }
}

exports.show = async function (req, res) {
  // Only returns PUBLIC information of restaurants
  try {
    let restaurant = await Restaurant.findByPk(req.params.restaurantId)
    const orderBy = restaurant.sortByPrice
      ? [[{ model: Product, as: 'products' }, 'price', 'ASC']]
      : [[{ model: Product, as: 'products' }, 'order', 'ASC']]

    restaurant = await Restaurant.findByPk(req.params.restaurantId, {
      attributes: { exclude: ['userId'] },
      include: [{
        model: Product,
        as: 'products',
        include: { model: ProductCategory, as: 'productCategory' }
      },
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      }],
      order: orderBy
    }
    )
    res.json(restaurant)
  } catch (err) {
    console.error('Error en el show', err)
    res.status(500).send(err)
  }
}

exports.update = async function (req, res) {
  if (typeof req.files?.heroImage !== 'undefined') {
    req.body.heroImage = req.files.heroImage[0].destination + '/' + req.files.heroImage[0].filename
  }
  if (typeof req.files?.logo !== 'undefined') {
    req.body.logo = req.files.logo[0].destination + '/' + req.files.logo[0].filename
  }
  try {
    await Restaurant.update(req.body, { where: { id: req.params.restaurantId } })
    const updatedRestaurant = await Restaurant.findByPk(req.params.restaurantId)
    res.json(updatedRestaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.destroy = async function (req, res) {
  try {
    const result = await Restaurant.destroy({ where: { id: req.params.restaurantId } })
    let message = ''
    if (result === 1) {
      message = 'Sucessfuly deleted restaurant id.' + req.params.restaurantId
    } else {
      message = 'Could not delete restaurant.'
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}
/*
exports.ordenEconomico = async function (req, res) {
  try {
    const restaurantesEconomicos = await Product.findAll(
      {
        include: [
          {
            model: Restaurant,
            as: 'restaurant',
            attributes: ['id', 'name', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'restaurantCategoryId', 'menu'],
            include:
        {
          model: RestaurantCategory,
          as: 'restaurantCategory'
        }
          }
        ],
        attributes: ['restaurantId', [Sequelize.fn('AVG', Sequelize.col('price')), 'averageItemCosts']],
        group: ['restaurantId'],
        order: [[Sequelize.col('averageItemCosts'), 'DESC']]
      })
    res.json(restaurantesEconomicos)
  } catch (err) {
    console.log('Error average', err)
    res.status(500).send(err)
  }
}
*/