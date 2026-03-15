# CART DOCUMENTATION

**Cart** is a feature for user add their selected product (**Cart Item**) to their database. In cart page user can select their cart item to be processed into checkout.

## FRONTEND

### Cart List

It's component to show details of **cart item**, the details contains:

- Product Name
- Product Image
- Product Price
- Product Quantity
- Subtotal of products price

Each **cart item** is saved in redux store _cart_, the stored data is

```ts
{
  "productId": {
    "quantity": number
  }
}[]
```

### Checkout Details

**Checkout details** is component to show user grand total of _selected_ items they will pay before process into next

Each **cart item** can be selected via selectbox, the selected item will be stored in redux store _checkout_, the stored data is

```ts
{
  "productId": boolean
}[]
```

### Select/Remove item on list

**Controller** is component that help user to select/deselect all items in _cart_

**Cart item** can be removed via single/multiple, single removal use the _remove button_ inside item details and multiple removal use _removal button_ at _controller_ component

## BACKEND

### Get user cart

Get current user cart items, used to load user cart item based on current store id

Endpoint: `GET /api/cart/store/:storeId`

Response:

```ts
{
  "status": "ok",
  "data": CartItem[]
}
```

### Upsert cart item to user cart

Add product to current user cart, if already item exist in cart increment the item quantity

Endpoint: `POST /api/cart`

Response:

```ts
{
  "status": "ok",
  "data": CartItem
}
```

### Update quantity of cart item

Update cart item quantity

Endpoint: `PUT /api/cart`

Response:

```ts
{
  "status": "ok",
  "data": CartItem
}
```

### Remove cart item

Remove cart item from user cart

Endpoint: `DELETE /api/cart/remove`

Query:

```ts
productIds = ProductIds[]
```

Response:

```ts
{
  "status": "ok",
  "data": productIds[]
}
```

## DATABASE

### Cart

```ts
{
  id        Int        @id @default(autoincrement())
  user      User       @relation(fields: [userId], references: [id])
  userId    Int        @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  CartItem  CartItem[]
}
```

### Cart Item

```ts
  id         Int       @id @default(autoincrement())
  cart       Cart      @relation(fields: [cartId], references: [id])
  cartId     Int
  product    Product   @relation(fields: [productId], references: [id])
  productId  Int
  quantity   Int
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  Checkout   Checkout? @relation(fields: [checkoutId], references: [id])
  checkoutId Int?

  @@unique([cartId, productId])
```

## TASK

- [x] Refactor to new folder structure
- [x] Change UI/UX Component
- [ ] Maximize useHooks for better perfomance
