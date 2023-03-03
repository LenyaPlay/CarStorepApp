import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Register } from "./components/Register";
import {Activate} from "./components/Activate";
import {Login} from "./components/Login";
import {Catalog} from "./components/Catalog";
import {AutoAuth} from "./components/AutoAuth";

const AppRoutes = [
  {
    index: true,
    element: <AutoAuth />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
    path: '/activate',
    element: <Activate /> 
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/catalog',
    element: <Catalog />
  },
  {
    path: '/autoauth',
    element: <AutoAuth />
  }
];

export default AppRoutes;
