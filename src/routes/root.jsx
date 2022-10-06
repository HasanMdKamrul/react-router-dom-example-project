import React, { useEffect } from "react";
import {
    Form,
    NavLink,
    Outlet,
    redirect,
    useLoaderData,
    useNavigation,
    useSubmit
} from "react-router-dom";
import { createContact, getContacts } from "../contacts";

export async function loader({ request }) {
  const url = new URL(request.url);

  const q = url.searchParams.get("q");

  const contactsArray = await getContacts(q);
  return { contacts: contactsArray, q };
}

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

const Root = () => {
  const submit = useSubmit();

  const { state, location } = useNavigation();
    
//   console.log(location)

//   console.log(new URLSearchParams(location.search))

  const searching = location && new URLSearchParams(location.search).has('q');

  // console.log(navigation)

  const { contacts, q } = useLoaderData();
  // console.log(contacts)

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
            className={searching ? "loading" : ""}
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => submit(event.currentTarget.form)}
            />
            <div hidden={!searching} id="search-spinner" aria-hidden  />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div className={state === "loading" ? "loading" : ""} id="detail">
        <Outlet />
      </div>
    </>
  );
};

export default Root;
