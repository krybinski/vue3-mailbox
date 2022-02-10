<template>
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in unarchivedEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
        @click="readEmail(email)"
      >
        <td><input type="checkbox" /></td>
        <td>{{ email.from }}</td>
        <td>
          <p>
            <strong>{{ email.subject }}</strong> - {{ email.body }}
          </p>
        </td>
        <td class="date">{{ format(new Date(email.sentAt), 'MMM do yyyy') }}</td>
        <td>
          <button @click="archiveEmail(email)">Archive</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { format } from 'date-fns';
import axios from 'axios';
import { EmailItem } from '@/types';

export default defineComponent({
  async setup() {
    const response = await axios.get<EmailItem[]>('http://localhost:3000/emails');
    const emails = ref(response.data);
    const sortedEmails = computed(() => {
      return [...emails.value].sort((e1, e2) => (e1.sentAt <= e2.sentAt ? 1 : -1));
    });
    const unarchivedEmails = computed(() => {
      return sortedEmails.value.filter((e) => !e.archived);
    });

    function readEmail(email: EmailItem) {
      email.read = true;
      updateEmail(email);
    }

    function archiveEmail(email: EmailItem) {
      email.archived = true;
      updateEmail(email);
    }

    function updateEmail(email: EmailItem) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    }

    return {
      format,
      emails,
      sortedEmails,
      unarchivedEmails,
      readEmail,
      archiveEmail,
    };
  },
});
</script>
