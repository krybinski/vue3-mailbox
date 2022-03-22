import { reactive } from 'vue';
import { EmailItem } from './../types';

const emails = reactive(new Set());

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

  return { emails, toggle, clear, addMultiple };
};

export default useEmailSelection;
