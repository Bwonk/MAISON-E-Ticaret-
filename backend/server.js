require('dotenv').config()

const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/checkout/session', async (req, res) => {
  try {
    const { productId, quantity, customer } = req.body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Test Ürün' },
          unit_amount: 1000,
        },
        quantity: quantity || 1,
      }],
      mode: 'payment',
      customer_email: customer?.email,
      success_url: 'http://localhost:5173/order/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/order/failed',
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`✅ Stripe server çalışıyor: localhost:${PORT}`))