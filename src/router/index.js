import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from "../firebase/firebaseConfig.js";
import { doc, getDoc } from 'firebase/firestore';

import Authentication from '@/views/Authentication.vue'
import Dashboard from '@/views/Dashboard.vue'

// Shop
import Orders from '@/views/shop/orders/Orders.vue'
import OrderDetails from '@/views/shop/orders/OrderDetails.vue'

import Products from '@/views/shop/products/Products.vue'
import AddNewProduct from '@/views/shop/products/AddNewProduct.vue'
import EditProduct from '@/views/shop/products/EditProduct.vue'

// Press
import Blog from '@/views/press/blog/Blog.vue'
import AddNewPost from '@/views/press/blog/AddNewPost.vue'
import EditPost from '@/views/press/blog/EditPost.vue'

import Reviews from '@/views/press/reviews/Reviews.vue'
import AddNewReview from '@/views/press/reviews/AddNewReview.vue'
import EditReview from '@/views/press/reviews/EditReview.vue'

import OurGentlemen from '@/views/press/ourgentlemen/OurGentlemen.vue'
import AddNewGentleman from '@/views/press/ourgentlemen/AddNewGentleman.vue'
import EditGentleman from '@/views/press/ourgentlemen/EditGentleman.vue'

// Pages
import Home from '@/views/pages/Home.vue'


// Function to fetch user role from Firestore
async function getUserRole(uid) {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data().userRole;
  } else {
    throw new Error('User does not exist');
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Authentication
    {
      path: '/',
      name: 'authentication',
      component: Authentication,
      meta: { hideNav: true },
    },
    // Dashboard
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    // Orders
    {
      path: '/orders',
      name: 'orders',
      component: Orders,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/orders/order-details/:id',
      name: 'order-details',
      component: OrderDetails,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    // Products
    {
      path: '/products',
      name: 'products',
      component: Products,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/products/add-new-product',
      name: 'add-new-product',
      component: AddNewProduct,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/products/edit-product/:id',
      name: 'edit-product',
      component: EditProduct,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    // Blog
    {
      path: '/blog',
      name: 'blog',
      component: Blog,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/blog/add-new-post',
      name: 'add-new-post',
      component: AddNewPost,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/blog/edit-post/:id',
      name: 'edit-post',
      component: EditPost,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    // Reviews
    {
      path: '/reviews',
      name: 'reviews',
      component: Reviews,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/reviews/add-new-review',
      name: 'add-new-review',
      component: AddNewReview,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/reviews/edit-review/:id',
      name: 'edit-review',
      component: EditReview,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    // Our Gentlemen
    {
      path: '/our-gentlemen',
      name: 'our-gentlemen',
      component: OurGentlemen,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/our-gentlemen/add-new-gentleman',
      name: 'add-new-gentleman',
      component: AddNewGentleman,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/our-gentlemen/edit-gentleman/:id',
      name: 'edit-gentleman',
      component: EditGentleman,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    // Pages
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
  ],

  // This is to fix the router not scrolling to top
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
})



// Route guard to check authentication and admin privileges
router.beforeEach(async (to, from, next) => {
  const currentUser = auth.currentUser; // Get the current user

  if (to.matched.some(record => record.meta.requiresAuth)) { // Check if the route requires authentication
    if (!currentUser) {
      return next({ name: 'signin' }); // Redirect to signin if not authenticated
    } else {
      if (to.matched.some(record => record.meta.requiresAdmin)) { // Check if the route requires admin privileges
        try {
          const userRole = await getUserRole(currentUser.uid); // Get the user role from Firestore
          if (userRole === 'admin') {
            return next(); // Continue if the user is an admin
          } else {
            return next({ name: 'signin' }); // Redirect to overview if not an admin
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          return next({ name: 'signin' }); // Redirect to signin if there was an error
        }
      }
      return next(); // Continue if no admin privileges are required
    }
  } else {
    return next(); // Continue if no authentication is required
  }
});


export default router
