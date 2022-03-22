<template>
  <BulkActionBar :emails="unarchivedEmails" />
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in unarchivedEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
      >
        <td>
          <input
            type="checkbox"
            @click="emailSelection.toggle(email)"
            :checked="emailSelection.emails.has(email)"
          />
        </td>
        <td @click="openEmail(email)">{{ email.from }}</td>
        <td @click="openEmail(email)">
          <p>
            <strong>{{ email.subject }}</strong> - {{ email.body }}
          </p>
        </td>
        <td class="date" @click="openEmail(email)">
          {{ format(new Date(email.sentAt), 'MMM do yyyy') }}
        </td>
        <td>
          <button @click="archiveEmail(email)">Archive</button>
        </td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @close-modal="openedEmail = null">
    <MailView :email="openedEmail" @change-email="changeEmail" />
  </ModalView>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { format } from 'date-fns';
import axios from 'axios';
import MailView from '@/components/MailView.vue';
import ModalView from '@/components/ModalView.vue';
import BulkActionBar from '@/components/BulkActionBar.vue';
import useEmailSelection from '@/composables/useEmailSelection';
import { EmailItem } from '@/types';

interface ChangeEmail {
  toggleRead?: () => void;
  toggleArchive?: () => void;
  save?: () => Promise<void> | void;
  closeModal?: () => void;
  changeIndex?: number;
}

export default defineComponent({
  components: {
    BulkActionBar,
    MailView,
    ModalView,
  },
  async setup() {
    const response = await axios.get<EmailItem[]>('http://localhost:3000/emails');
    const emails = ref(response.data);
    const sortedEmails = computed(() => {
      return [...emails.value].sort((a, b) => (a.sentAt <= b.sentAt ? 1 : -1));
    });
    const unarchivedEmails = computed(() => {
      return sortedEmails.value.filter((e) => !e.archived);
    });
    const openedEmail = ref<EmailItem | null>(null);

    function openEmail(email: EmailItem) {
      if (email) {
        email.read = true;
        updateEmail(email);
      }

      openedEmail.value = email;
    }

    function archiveEmail(email: EmailItem) {
      email.archived = true;
      updateEmail(email);
    }

    function updateEmail(email: EmailItem) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    }

    function changeEmail({
      toggleRead,
      toggleArchive,
      save,
      closeModal,
      changeIndex,
    }: ChangeEmail) {
      const email = openedEmail.value;

      if (!email) return;

      if (toggleRead) {
        email.read = !email.read;
      }

      if (toggleArchive) {
        email.archived = !email.archived;
      }

      if (save) {
        updateEmail(email);
      }

      if (closeModal) {
        openedEmail.value = null;
      }

      if (changeIndex) {
        if (!openedEmail.value) {
          return;
        }

        const emails = unarchivedEmails.value;
        const currentIndex = emails.indexOf(openedEmail.value);
        const newEmail = emails[currentIndex + changeIndex];

        openEmail(newEmail);
      }
    }

    return {
      format,
      emails,
      sortedEmails,
      unarchivedEmails,
      openedEmail,
      openEmail,
      archiveEmail,
      changeEmail,
      emailSelection: useEmailSelection(),
    };
  },
});
</script>
