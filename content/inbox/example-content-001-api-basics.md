# Understanding REST APIs - A Beginner's Guide

## What is an API?

An API (Application Programming Interface) is like a waiter in a restaurant. You (the customer) tell the waiter what you want, and the waiter brings your request to the kitchen (the server) and then brings back your food (the response).

## Key Concepts

### 1. Endpoints
Think of endpoints as different menu items. Each endpoint serves a specific purpose:
- `/users` - Get user information
- `/posts` - Get blog posts
- `/products` - Get product listings

### 2. HTTP Methods
These are like different ways to interact with the menu:
- **GET** - Read data (like reading the menu)
- **POST** - Create new data (like ordering a new dish)
- **PUT** - Update existing data (like modifying your order)
- **DELETE** - Remove data (like canceling an order)

### 3. Request and Response
- **Request**: What you send to the API (your order)
- **Response**: What the API sends back (your food)

## Example Code

```javascript
// Simple GET request
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Why APIs Matter

APIs allow different applications to talk to each other. This is how:
- Your weather app gets data from weather services
- Your social media feed updates with new posts
- Your banking app shows your current balance

Understanding APIs is crucial for modern web development and automation.