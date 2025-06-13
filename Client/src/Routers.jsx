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
import DetailPage from "./pages/User/Shop/DetailPage";
import AddNewProduct from "./pages/Admin/Management/Product/ProductModalForm";
import ProductsPage from "./pages/Admin/Management/Product/productPage";
import ListingCategory from "./pages/Admin/Management/Category/ListingCategoryPage";
import ShopPage from "./pages/User/Shop/HomePage";
import SellerListPage from "./pages/Admin/Management/Seller/SellerListPage";
import AddSellerForm from "./pages/Admin/Management/Seller/AddSeller";
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
import GoogleAuth from "./pages/User/Login/components/GoogleAuth";
import { AUTH_ROUTES, MANAGEMENT_ROUTES, USER_ROUTES } from "./config/routerConstants";
import WishListPage from "./pages/User/WishList/WishListPage";
import CouponListPage from "./pages/Admin/Management/Coupon/CouponListPage";
import OfferPageList from "./pages/Admin/Management/Offers/OfferPageList";
import SalesReportPage from "./pages/Admin/Management/Sales/SalesReportPage";
import PaymentPolicyPage from "./pages/User/Account/PaymentPolicyPage";
import Wallet from "./pages/User/Account/Wallet";
import ProductTable from "./pages/Test/ShadcnTable";
import About from "./pages/User/Home/About";
import Contact from "./pages/User/Home/Contact";
import TermsAndConditions from "./pages/User/Account/TermAndCondition";

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
        path: USER_ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: USER_ROUTES.ABOUT,
        element: <About />,
      },
      {
        path: USER_ROUTES.CONTACT,
        element: <Contact />,
      },
      {
        path: USER_ROUTES.SHOP,
        element: <ShopPage />,
      },
      {
        path: USER_ROUTES.CART,
        element: <CartPage />,
      },
      {
        path: USER_ROUTES.PAYMENT_SUCCESS,
        element: <OrderSuccessPage />,
      },
      {
        path: `${USER_ROUTES.CHECKOUT}/:orderId`,
        element: <CheckoutPage />,
      },
      {
        path: `${USER_ROUTES.SHOP}/:productId`,
        element: <DetailPage />,
      },
      {
        path: USER_ROUTES.ACCOUNT,
        element: <AccountLayout />,
        children: [
          {
            path: USER_ROUTES.ORDERS,
            element: <Orders />,
          },
          {
            path: `${USER_ROUTES.ORDER_DETAILS}/:orderId`,
            element: <OrderDetailPage />,
          },
          {
            path: USER_ROUTES.WISHLIST,
            element: <WishListPage />,
          },
          {
            path: USER_ROUTES.PAYMENT_POLICY,
            element: <PaymentPolicyPage />,
          },
          {
            path: USER_ROUTES.WALLET,
            element: <Wallet />,
          },
          {
            path: USER_ROUTES.MY_REVIEWS,
            element: <DetailPage />,
          },
          {
            path: USER_ROUTES.PROFILE,
            element: <ProfilePage />,
          },
          {
            path: USER_ROUTES.TERMS_AND_CONDITION,
            element: <TermsAndConditions />,
          },
          {
            path: USER_ROUTES.MY_ADDRESS,
            element: <Address />,
          },
        ]
      },
    ]
  },


  //Admin Routes
  {
    path: MANAGEMENT_ROUTES.MANAGEMENT,
    element: <AdminLayoutPage />,
    children: [
      {
        path: MANAGEMENT_ROUTES.DASHBOARD,
        element: <DashboardPage />
      },
      {
        path: MANAGEMENT_ROUTES.ORDERS,
        element: <OrderListPage />
      },
      {
        path: MANAGEMENT_ROUTES.PRODUCTS,
        children: [
          {
            path: MANAGEMENT_ROUTES.PRODUCTS_LIST,
            element: <ProductsPage />
          },
          // {
          //   path: MANAGEMENT_ROUTES.PRODUCTS_ADD_NEW_PRODUCT,
          //   element: <AddNewProduct />
          // },
          // {
          //   path: `${MANAGEMENT_ROUTES.PRODUCTS_EDIT}/:id`,
          //   element: <EditProduct />
          // },
          {
            path: `${MANAGEMENT_ROUTES.PRODUCTS_EDIT}/:id`,
            element: <AddNewProduct />
          }
        ]
      },
      {
        path: MANAGEMENT_ROUTES.USERS,
        children: [
          {
            path: MANAGEMENT_ROUTES.USERS_LIST,
            element: <UsersListPage />
          }
        ]
      },
      {
        path: MANAGEMENT_ROUTES.SELLERS,
        children: [
          {
            path: MANAGEMENT_ROUTES.SELLERS_LIST,
            element: <SellerListPage />
          },
          {
            path: MANAGEMENT_ROUTES.SELLERS_ADD,
            element: <AddSellerForm />
          }
        ]
      },
      {
        path: MANAGEMENT_ROUTES.CATEGORY,
        children: [
          {
            path: MANAGEMENT_ROUTES.CATEGORY_LIST,
            element: <ListingCategory />
          }
        ]
      },
      {
        path: MANAGEMENT_ROUTES.COUPON,
        children: [
          {
            path: MANAGEMENT_ROUTES.COUPON_LIST,
            element: <CouponListPage />
          }
        ]
      },
      {
        path: MANAGEMENT_ROUTES.OFFER,
        children: [
          {
            path: MANAGEMENT_ROUTES.OFFER_LIST,
            element: <OfferPageList />
          }
        ]
      },
      {
        path: MANAGEMENT_ROUTES.SALES_REPORT,
        element: <SalesReportPage />
      }
    ]
  },

  // User Auth Routes
  {
    path: AUTH_ROUTES.AUTH,
    element: (
      <AuthPage />
    ),
    children: [
      {
        path: AUTH_ROUTES.LOGIN_USER,
        element: <LoginForm />,
      },
      {
        path: AUTH_ROUTES.REGISTER_USER,
        element: <RegisterForm />,
      }
    ]
  },

  // Admin Auth Routes
  {
    path: AUTH_ROUTES.MANAGEMENT_AUTH,
    children: [
      {
        path: AUTH_ROUTES.SELLER_LOGIN,
        element: (
          <AdministratorLoginPage />
        )
      },
      {
        path: AUTH_ROUTES.ADMIN_LOGIN,
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
    element: <ProductTable />,
  },




  //Error
  {
    path: 'error',
    element: <ErrorPage />
  }

])

export default routers