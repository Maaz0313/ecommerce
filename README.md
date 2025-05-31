# Ecommerce Application

A modern ecommerce platform built with Laravel 12 for the backend API and React 19 with Next.js and Tailwind CSS for the frontend.

## 🚧 Project Status

This project is currently under active development. New features are being added regularly.

## ✨ Features Implemented

### User Authentication

- User registration with email verification
- Login/logout functionality
- Password reset capabilities
- Protected routes for authenticated users

### Product Management

- Product listing with search and filtering
- Product details page with images and descriptions
- Featured products on homepage
- Product categorization

### Shopping Experience

- Product browsing by category
- Shopping cart functionality
- Add/remove items from cart
- Update quantities in cart

### Checkout Process

- Secure checkout flow with Laravel Cashier
- Stripe credit/debit card payment processing
- Multiple payment method options (Credit Card, PayPal, Cash on Delivery)
- Order summary before confirmation
- Order confirmation page

### User Dashboard

- View and manage personal information
- Order history with status tracking
- Order details view
- Cancel pending orders

### Category Management

- Browse products by category
- Category listing page
- Category detail pages

## 🔮 Planned Features

The following features are planned for future development:

- Admin dashboard for product and order management
- User reviews and ratings for products
- Wishlist functionality
- Advanced search with filters
- Product recommendations
- Discount codes and promotions
- Multiple shipping options
- Social media login integration
- Multi-language support
- Mobile app version

## 🛠️ Technology Stack

### Backend

- Laravel 12
- MySQL database
- RESTful API architecture
- Laravel Sanctum for authentication
- Laravel Cashier for Stripe payment processing

### Frontend

- React 19
- Next.js for server-side rendering
- Tailwind CSS for styling
- TypeScript for type safety

## 📋 Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- npm or yarn
- MySQL

## 🚀 Getting Started

### Backend Setup

```bash
cd backend/api
composer install
cp .env.example .env
# Configure your database in .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application in action.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Your Name - Initial work and ongoing development
