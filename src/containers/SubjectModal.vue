<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit group' : 'Add new group'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input
          label="Name"
          type="text"
          :v="$v.name"
          placeholder="Something"
          v-model="name"
        />
        <base-input
          label="Credits"
          type="number"
          :v="$v.credits"
          placeholder="1"
          v-model="credits"
        />
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  name: 'subject-modal',
  data: () => ({
    name: '',
    credits: 0
  }),
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  mounted() {
    if (this.id) {
      const subject = this.subjectQuery(this.id);
      this.name = subject.name;
      this.credits = subject.credits;
    }
  },
  computed: {
    ...mapState('Modal', ['modalOpen', 'modalComponent']),
    ...mapGetters({
      subjectQuery: 'entities/subjects/find'
    })
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    ...mapActions('Subject', ['postSubject', 'updateSubject']),
    modalCloseAction() {
      this.modalClose();
    },
    submitMethod() {
      if (!this.$v.$invalid) {
        const object = {
          name: this.name,
          credits: this.credits,
          facultyId: this.$route.params.id
        };
        if (this.id) {
          this.updateSubject({ id: this.id, object });
        } else {
          this.postSubject({ ...object });
        }
        this.modalClose();
      }
    }
  },
  mixins: [validationMixin],
  components: {
    BaseModalContent,
    BaseButton,
    BaseInput
  },
  validations: {
    name: {
      required
    },
    credits: {
      required
    }
  }
};
</script>
