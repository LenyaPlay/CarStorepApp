import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Register } from "./components/Register";
import {Activate} from "./components/Activate";
import {Login} from "./components/Login";

const AppRoutes = [
  {
    index: true,
    element: <Register />
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
  }
];

export default AppRoutes;
