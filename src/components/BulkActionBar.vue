<template>
  <div>
    <input
      type="checkbox"
      :checked="allEmailsSelected"
      :class="[someEmailsSelected ? 'partial-check' : '']"
      @click="bulkSelect"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import useEmailSelection from '@/composables/useEmailSelection';
import { EmailItem } from '../types';

export default defineComponent({
  setup(props) {
    const emailSelection = useEmailSelection();
    const numberSelected = computed(() => emailSelection.emails.size);
    const numberEmails = computed(() => props.emails.length);
    const allEmailsSelected = computed(() => {
      return numberSelected.value === numberEmails.value;
    });
    const someEmailsSelected = computed(() => {
      return numberSelected.value > 0 && numberSelected.value < numberEmails.value;
    });

    const bulkSelect = () => {
      if (allEmailsSelected.value) {
        emailSelection.clear();
      } else {
        emailSelection.addMultiple(props.emails);
      }
    };

    return {
      allEmailsSelected,
      someEmailsSelected,
      bulkSelect,
    };
  },
  props: {
    emails: {
      type: Array as PropType<EmailItem[]>,
      required: true,
    },
  },
});
</script>
