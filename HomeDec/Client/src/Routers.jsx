import {
  createBrowserRouter,
} from "react-router-dom";
import AuthPage from "./pages/User/Login/AuthPage";
import LoginForm from "./pages/User/Login/components/LoginForm";
import RegisterForm from "./pages/User/Login/components/RegisterForm";
import HomePage from "./pages/User/Home/HomePage";
import AdminLayoutPage from "./pages/Admin/Home/AdminLayout";
import DashboardPage from "./pages/Admin/Home/DashBoard";
import UsersListPage from "./pages/Admin/Management/User/UsersListPage";
import ErrorPage from "./pages/ErrorPage";
import AdministratorLoginPage from "./pages/Admin/AdministratorsLogin/AdministratorLoginPage";
import DetailPage from "./pages/Admin/Management/Product/DetailPage";
import AddNewProduct from "./pages/Admin/Management/Product/AddNewProduct";
import ProductsPage from "./pages/Admin/Management/Product/productPage";
import ListingCategory from "./pages/Admin/Management/Category/ListingCategoryPage";
import ShopPage from "./pages/User/Shop/HomePage";
import SellerListPage from "./pages/Admin/Management/Seller/SellerListPage";
import AddSellerForm from "./pages/Admin/Management/Seller/AddSeller";
import EditProduct from "./pages/Admin/Management/Product/EditProduct";
import UserLayout from "./pages/User/Home/UserLayout";
import CartPage from "./pages/User/Cart/CartPage";
import AccountLayout from "./pages/User/Account/AccountLayout";
import ProfilePage from "./pages/User/Account/ProfilePage";
import Address from "./pages/User/Account/Address";
import CheckoutPage from "./pages/User/Cart/Checkout/CheckoutPage";
import OrderSuccessPage from "./pages/User/Cart/Checkout/OrderSuccessPage";
import OrderListPage from "./pages/Admin/Management/Orders/OrderListPage";
import Orders from "./pages/User/Account/Orders";
import OrderDetailPage from "./pages/User/Account/OrderDetailPage";
import TestToast from "./pages/Test/AddNewProductTestPage";
import GoogleAuth from "./pages/User/Login/components/GoogleAuth";

const routers = createBrowserRouter([

  {
    path: "auth/google/:token",
    element: <GoogleAuth />,
  },

  //User Routes
  {
    path: "",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "shop",
        element: <ShopPage />,
      },
      {
        path: "shop/cart",
        element: <CartPage />,
      },
      {
        path: "shop/cart/checkout/success",
        element: <OrderSuccessPage />,
      },
      {
        path: "shop/cart/checkout/:orderId",
        element: <CheckoutPage />,
      },
      {
        path: "shop/:productId",
        element: <DetailPage />,
      },
      {
        path: "account",
        element: <AccountLayout />,
        children: [
          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "orders/in-detail/:orderId",
            element: <OrderDetailPage />,
          },
          {
            path: "wishlist",
            element: <DetailPage />,
          },
          {
            path: "my-reviews",
            element: <DetailPage />,
          },
          {
            path: "personal-info",
            element: <ProfilePage />,
          },
          {
            path: "my-addresses",
            element: <Address />,
          },
        ]
      },
    ]
  },


  //Admin Routes
  {
    path: "admin",
    element: <AdminLayoutPage />,
    children: [
      {
        path: "",
        element: <DashboardPage />
      },
      {
        path: "product-details",
        element: <DetailPage />
      },
      {
        path: "orders",
        element: <OrderListPage />
      },
      {
        path: "products",
        children: [
          {
            path: "list",
            element: <ProductsPage />
          },
          {
            path: "add-new-product",
            element: <AddNewProduct />
          },
          {
            path: "edit/:id",
            element: <EditProduct />
          }
        ]
      },
      {
        path: "users",
        children: [
          {
            path: "list",
            element: <UsersListPage />
          }
        ]
      },
      {
        path: "sellers",
        children: [
          {
            path: "list",
            element: <SellerListPage />
          },
          {
            path: "add",
            element: <AddSellerForm />
          }
        ]
      },
      {
        path: "category",
        children: [
          {
            path: "list",
            element: <ListingCategory />
          }
        ]
      }
    ]
  },

  // Seller Router 
  {
    path: "seller",
    element: <AdminLayoutPage />,
    children: [
      {
        path: "",
        element: <DashboardPage />
      },
      {
        path: "orders",
        element: <OrderListPage />
      },
      {
        path: "product-details",
        element: <DetailPage />
      },
      {
        path: "products",
        children: [
          {
            path: "list",
            element: <ProductsPage />
          },
          {
            path: "add-new-product",
            element: <AddNewProduct />
          },
          {
            path: "edit/:id",
            element: <EditProduct />
          }
        ]
      },
      {
        path: "users",
        children: [
          {
            path: "list",
            element: <UsersListPage />
          }
        ]
      },
      {
        path: "sellers",
        children: [
          {
            path: "list",
            element: <SellerListPage />
          },
          {
            path: "add",
            element: <AddSellerForm />
          }
        ]
      },
      {
        path: "category",
        children: [
          {
            path: "list",
            element: <ListingCategory />
          }
        ]
      }
    ]
  },

  // User Auth Routes
  {
    path: "",
    element: (
      <AuthPage />
    ),
    children: [
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "register",
        element: <RegisterForm />,
      }
    ]
  },

  // Admin Auth Routes
  {
    path: "auth",
    children: [
      {
        path: "seller",
        element: (
          <AdministratorLoginPage />
        )
      },
      {
        path: "admin",
        element: (
          <AdministratorLoginPage />
        )
      },
    ]
  },


  //Test Route
  // {
  //   path: "/testImage",
  //   element: <ImageCrop />,
  // },
  // {
  //   path: "/home",
  //   element: <NewHome />,
  // },
  // {
  //   path: "/shop",
  //   element: <ShopPage />,
  // },
  {
    path: "/abcd",
    element: <TestToast />,
  },




  //Error
  {
    path: 'error',
    element: <ErrorPage />
  }

])

export default routers