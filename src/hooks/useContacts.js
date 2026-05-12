import { useState, useEffect, useCallback } from "react";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../services/api";

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getContacts();
      setContacts(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addContact = useCallback(async (contactData) => {
    try {
      const response = await createContact(contactData);
      setContacts((prev) => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const editContact = useCallback(async (id, contactData) => {
    try {
      const response = await updateContact(id, contactData);
      setContacts((prev) =>
        prev.map((contact) => (contact.id === id ? response.data : contact)),
      );
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const removeContact = useCallback(async (id) => {
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    addContact,
    editContact,
    removeContact,
  };
};
