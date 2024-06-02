const buttons = document.querySelectorAll('.store__category-button')

// !
// ! =================================================================================
// !      fetchProductByCategory() renderProducts()
// ! =================================================================================
// !
const API_URL = 'https://gregarious-goofy-basement.glitch.me'

// /api/products/category

const productList = document.querySelector('.store__card-list')

// const createProductCard = (product) => {
const createProductCard = ({ name, price, photoUrl }) => {
  const productCard = document.createElement('li')
  productCard.classList.add('store__card-item')
  productCard.innerHTML = `
  <article class="store__product product">
      <img class="product__image" src="${API_URL}${photoUrl}" alt=${name} width='388' height='261'>
      <h3 class="product__title">${name}</h3>
      <p class="product__price">${price}&nbsp;₽</p>
      <button class="product__btn-add-cart">Заказать</button>
  </article>`

  return productCard
}

const renderProducts = (products) => {
  productList.textContent = ''
  products.forEach((product) => {
    const productCard = createProductCard(product)
    productList.append(productCard)
  })
}

const fetchProductByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/api/products/category/${category}`)
    if (!response.ok) {
      throw new Error(response.status)
    }
    const products = await response.json()

    renderProducts(products)
  } catch (error) {
    console.error(`Ошибка запроса товаров : ${error}`)
  }
}

// !
// !  =========================================================================
// !  cartButton
// !  =========================================================================
// !
const cartButton = document.querySelector('.store__cart-button')
const modalOverlay = document.querySelector('.modal-overlay')
const cartList = document.querySelector('.modal__cart-list')
const closeButton = document.querySelector('.modal-overlay__close-button')

const changeCategory = ({ target }) => {
  const category = target.textContent

  buttons.forEach((button) => {
    button.classList.remove('store__category-button_active')
  })

  target.classList.add('store__category-button_active')
  fetchProductByCategory(category)
}

buttons.forEach((button) => {
  button.addEventListener('click', changeCategory)
  if (button.classList.contains('store__category-button_active')) {
    fetchProductByCategory(button.textContent)
  }
})

const renderCartItems = () => {
  // cartList.textContent = ''
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
  cartItems.forEach((item) => {
    const listItem = document.createElement('li')
    listItem.textContent = item
    // cartList.append(listItem)
  })
}

cartButton.addEventListener('click', () => {
  modalOverlay.style.display = 'flex'
  renderCartItems()
})

modalOverlay.addEventListener('click', ({ target }) => {
  if (target === modalOverlay || target.closest('.modal-overlay__close-button')) {
    modalOverlay.style.display = 'none'
  }
})

// localStorage.setItem('cartItems', JSON.stringify([1, 2, 3]))

const cartCount = cartButton.querySelector('.store__cart-count')

const updateCartCount = () => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
  cartCount.textContent = cartItems.length
}
updateCartCount()

const addToCart = (productName) => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
  cartItems.push(productName)
  localStorage.setItem('cartItems', JSON.stringify(cartItems))
  updateCartCount()
}

productList.addEventListener('click', ({ target }) => {
  if (target.closest('.product__btn-add-cart')) {
    const productCard = target.closest('.store__product')
    console.log(productCard)

    const productName = productCard.querySelector('.product__title').textContent
    addToCart(productName)
  }
})
