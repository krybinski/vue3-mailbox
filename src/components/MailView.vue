<template>
  <div class="email-display">
    <div>
      <button @click="toggleArchive">
        {{ email.archived ? 'Move to Inbox(e)' : 'Archive (e)' }}
      </button>
      <button @click="toggleRead">{{ email.read ? 'Mark Unread (r)' : 'Mark Read (r)' }}</button>
      <button @click="goNewer">Newer (n)</button>
      <button @click="goOlder">Older (o)</button>
    </div>
    <h2 class="mb-0">
      Subject: <strong>{{ email.subject }}</strong>
    </h2>
    <div>
      <em>From {{ email.from }} on {{ format(new Date(email.sentAt), 'MMM do yyyy') }}</em>
    </div>
    <div v-html="marked(email.body)" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { format } from 'date-fns';
import { marked } from 'marked';
import useKeydown from '@/composables/useKeydown';
import { EmailItem } from '@/types';

export default defineComponent({
  props: {
    email: {
      type: Object as PropType<EmailItem>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const toggleRead = () => {
      emit('changeEmail', { toggleRead: true, save: true });
    };

    const toggleArchive = () => {
      emit('changeEmail', { toggleArchive: true, save: true, closeModal: true });
    };

    const goNewer = () => {
      emit('changeEmail', { changeIndex: -1 });
    };

    const goOlder = () => {
      emit('changeEmail', { changeIndex: 1 });
    };

    const goNewerAndArchive = () => {
      emit('changeEmail', { changeIndex: -1, toggleArchive: true, save: true });
    };

    const goOlderAndArchive = () => {
      emit('changeEmail', { changeIndex: 1, toggleArchive: true, save: true });
    };

    useKeydown([
      { key: 'e', fn: toggleArchive },
      { key: 'r', fn: toggleRead },
      { key: 'n', fn: goNewer },
      { key: 'o', fn: goOlder },
      { key: '[', fn: goNewerAndArchive },
      { key: ']', fn: goOlderAndArchive },
    ]);

    return { format, marked, toggleArchive, toggleRead, goNewer, goOlder };
  },
});
</script>
