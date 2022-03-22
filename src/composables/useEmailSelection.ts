import { reactive } from 'vue';
import axios from 'axios';
import { EmailItem } from './../types';

type SaveSelectedFn = (email: EmailItem) => void;
type SaveSelected = (fn: SaveSelectedFn) => void;

const emails = reactive<Set<EmailItem>>(new Set());

const useEmailSelection = () => {
  const toggle = (email: EmailItem) => {
    if (emails.has(email)) {
      emails.delete(email);
    } else {
      emails.add(email);
    }
  };

  const clear = () => {
    emails.clear();
  };

  const addMultiple = (newEmails: EmailItem[]) => {
    newEmails.forEach((email) => {
      emails.add(email);
    });
  };

  const saveSelected: SaveSelected = (fn) => {
    emails.forEach((email) => {
      fn(email);
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    });
  };

  const markRead = () => saveSelected((email) => (email.read = true));
  const markUnread = () => saveSelected((email) => (email.read = false));
  const archive = () => {
    saveSelected((email) => (email.archived = true));
    clear();
  };

  return { emails, toggle, clear, addMultiple, markRead, markUnread, archive };
};

export default useEmailSelection;
