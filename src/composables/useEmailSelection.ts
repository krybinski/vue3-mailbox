import { EmailItem } from './../types';
import { reactive } from 'vue';

const emails = reactive(new Set());

const useEmailSelection = () => {
  const toggle = (email: EmailItem) => {
    if (emails.has(email)) {
      emails.delete(email);
    } else {
      emails.add(email);
    }
  };

  return { emails, toggle };
};

export default useEmailSelection;
