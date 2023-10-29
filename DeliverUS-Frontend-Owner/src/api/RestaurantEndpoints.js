import { get, post, put, destroy, patch } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('users/myrestaurants')
}

function getDetail (id) {
  return get(`restaurants/${id}`)
}

function getRestaurantCategories () {
  return get('restaurantCategories')
}

function postRestaurantCategories (data) {
  return post('restaurantCategories', data)
}

function create (data) {
  return post('restaurants', data)
}

function update (id, data) {
  return put(`restaurants/${id}`, data)
}

function remove (id) {
  return destroy(`restaurants/${id}`)
}

function toggleProductsSorting (id) {
  return patch(`restaurants/${id}/toggleProductsSorting`)
}
function toggleRestaurantMenu (id) {
  return patch(`restaurants/${id}/toggleRestaurantMenu`)
}
export { getAll, getDetail, getRestaurantCategories, create, update, remove, postRestaurantCategories, toggleProductsSorting, toggleRestaurantMenu }
