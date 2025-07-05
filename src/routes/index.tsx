import App from "@/App";
import AddBooks from "@/pages/AddBooks";
import Books from "@/pages/Books";

import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
    {
    path: "",
    Component : App,
    children :[
        {
            path: "/",
            Component : Books,
        },
        {
            path : "create-book",
            Component : AddBooks,
        }
     
    ]
}]) 

export default router;