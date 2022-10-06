import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider
} from "react-router-dom";
import { deleteContact, getContact, updateContact } from "./contacts";
import ErrorPage from "./error-page";
import "./index.css";
import Index from "./routes";
import Contact from "./routes/contact";
import EditContact from "./routes/edit";
import Root, {
  action as rootAction,
  loader as rootLoader
} from "./routes/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        index : true,
        // path: '/',
        element: <Index/>
      },
      {
        path: "contacts/:contactId",
        loader: async ({ params: { contactId } }) => getContact(contactId),
        element: <Contact />,
        action: async ({request,params})=> {
          let formData = await request.formData();
          return updateContact(params.contactId, {
            favorite: formData.get("favorite") === "true",
          });
        },
      },
      {
        path: '/contacts/:contactId/destroy',
        action: async ({params:{contactId}})=> {
          throw new Error ('Oh Dang!')
          await deleteContact(contactId);
          return redirect(`/`);
        },
        errorElement: <div>Opps There was an error!</div>
      },
      {
        path: "contacts/:contactId/edit",
        loader: async ({ params: { contactId } }) => getContact(contactId),
        element: <EditContact />,
        action: async ({ request, params:{contactId} }) => {
          const formData = await request.formData();
          const updates = Object.fromEntries(formData);
          await updateContact(contactId, updates);
          return redirect(`/contacts/${contactId}`);
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
