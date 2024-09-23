import {
  createBrowserRouter,
} from "react-router-dom";
import AuthPage from "./pages/User/Login/AuthPage";
import LoginForm from "./pages/User/Login/components/LoginForm";
import RegisterForm from "./pages/User/Login/components/RegisterForm";
import HomePage from "./pages/User/Home/HomePage";
import AdminLoginForm from "./pages/Admin/AdminLogin/AdminLoginPage";
import AdminLayoutPage from "./pages/Admin/Home/AdminLayout";
import ProductsPage from "./pages/Admin/ProductPage/productPage";
import DashboardPage from "./pages/Admin/Home/DashBoard";
import UsersListPage from "./pages/Admin/Home/UsersListPage";
import HandleCategoryPage from "./pages/Admin/Home/HandleCategoryPage";
import SellerListPage from "./pages/Admin/Home/SellerListPage";
import AddSellerForm from "./pages/Admin/Home/AddSeller";
import SellerLoginForm from "./pages/Seller/SellerLogin/LoginPage";
import AddNewProduct from "./pages/Admin/ProductPage/AddNewProduct";
import DetailPage from "./pages/Admin/ProductPage/DetailPage";
import ImageCrop from "./pages/Test/ImageCrop";
import NewHome from "./pages/User/Home/NewHome";

const routers = createBrowserRouter([
  //Auth Routes
  {
    path: "auth",
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
      },
      {
        path: "admin",
        element: <AdminLoginForm />,
      },
      {
        path: "seller",
        element: <SellerLoginForm />,
      }
    ]
  },
  //User Routes
  {
    path: "/",
    element: <HomePage />,
  },
  //Admin Routes
  {
    path: "/admin",
    element: <AdminLayoutPage />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />
      },
      {
        path: "products",
        element: <ProductsPage />
      },
      {
        path: "add-new-product",
        element: <AddNewProduct />
      },
      {
        path: "product-details",
        element: <DetailPage />
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
            element: <HandleCategoryPage />
          }
        ]
      }
    ]
  },
  //Test Route
  {
    path: "/testImage",
    element: <ImageCrop />,
  },
  {
    path: "/home",
    element: <NewHome />,
  }

])

export default routers