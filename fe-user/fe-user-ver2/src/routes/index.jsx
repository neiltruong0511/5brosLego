import Home from "../pages/Home"
import About from "../pages/About"
import Cart from "../pages/Cart"
import Payment from "../pages/Payment"
import Product from "../pages/Product"
import DetailProduct from "../pages/DetailProduct"
import Login from "../pages/Auth/Login/Login"
import Signin from "../pages/Auth/Signin/Signin"
import Evaluate from "../pages/Evaluate"
import ThankYou from "../pages/Thankyou"
const privateRoute = [
 {path: "/", element: Home},
 {path:"/about", element: About},
 {path:"/cart", element: Cart},
 {path:"/payment", element: Payment},
 {path:"/product", element: Product},
 {path:"/product/:id", element: DetailProduct},
 {path:"/login", element: Login, layout: null},
 {path:"/signin", element: Signin, layout: null},
 {path:"/evaluate", element: Evaluate, layout: null},
 {path:"/thankyou", element: ThankYou, layout: null},
]

const publicRoute = {
    
}

export {privateRoute};