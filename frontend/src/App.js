
import { useEffect, useState } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const API_URL = "http://localhost:5000/api/contacts";

  // LOAD CONTACTS
  const loadContacts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setContacts(data);
    } catch {
      toast.error("Failed to load contacts");
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone }),
        });
        toast.success("Contact updated");
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone }),
        });
        toast.success("Contact added");
      }

      setName("");
      setEmail("");
      setPhone("");
      setEditingId(null);
      loadContacts();
    } catch {
      toast.error("Operation failed");
    }
  };

  // DELETE
  const remove = async (id) => {
    if (!window.confirm("Delete this contact?")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      toast.success("Contact deleted");
      loadContacts();
    } catch {
      toast.error("Delete failed");
    }
  };

  // EDIT
  const edit = (c) => {
    setEditingId(c._id);
    setName(c.name);
    setEmail(c.email);
    setPhone(c.phone);
    toast.info("Editing contact");
  };

  // SHOW LIMITED OR ALL
  const visibleContacts = showAll ? contacts : contacts.slice(0, 3);

  return (
    <div className="app-wrapper">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="container">
        <h2>Contact Management App</h2>

        <div className="grid">
          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button type="submit">
              {editingId ? "Update Contact" : "Add Contact"}
            </button>
          </form>

          {/* CONTACT LIST */}
          <div>
            <ul>
              {visibleContacts.map((c) => (
                <li key={c._id}>
                  <div className="contact-info">
                    <strong>{c.name}</strong>
                    <div>{c.email}</div>
                    <div>{c.phone}</div>
                  </div>

                  <div className="actions">
                    <button onClick={() => edit(c)}>Edit</button>
                    <button onClick={() => remove(c._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>

            {/* VIEW ALL BUTTON */}
            {contacts.length > 4 && (
              <button
                className="view-btn"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : "View All Contacts"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;