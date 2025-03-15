// //pages/api/stripe/checkout_session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('Non-POST request received:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData } = req.body;
    console.log('Received formData in checkout_sessions:', formData);

    if (!formData || !formData.packageTitle || (!formData.packagePrice && !formData.totalCost) || !formData.bookingType || !formData.userId) {
      console.error('Invalid or missing formData:', formData);
      return res.status(400).json({ error: 'Missing required formData fields' });
    }

    // Split formData into chunks
    const formDataString = JSON.stringify(formData);
    const maxChunkSize = 500;
    const metadata: { [key: string]: string } = {
      bookingType: formData.bookingType,
      userId: formData.userId,
    };

    // Split formDataString into multiple keys
    for (let i = 0; i < formDataString.length; i += maxChunkSize) {
      const chunk = formDataString.slice(i, i + maxChunkSize);
      metadata[`formData${Math.floor(i / maxChunkSize) + 1}`] = chunk;
    }

    console.log('Metadata prepared:', metadata);

    const price = formData.totalCost || formData.packagePrice; // Use totalCost for walking, packagePrice for others
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: formData.packageTitle,
            },
            unit_amount: parseInt(price.replace('₹', '')) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/services/confirmation?packageTitle=${encodeURIComponent(formData.packageTitle)}&packagePrice=${encodeURIComponent(price)}&paymentMethod=Stripe`,
      cancel_url: `${req.headers.origin}/services/payment`,
      metadata,
    });

    console.log('Created Stripe session with ID:', session.id);
    return res.status(200).json({ id: session.id });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error occurred');
    console.error('Error creating Stripe session:', err.message);
    return res.status(500).json({ error: 'Failed to create payment session' });
  }
}