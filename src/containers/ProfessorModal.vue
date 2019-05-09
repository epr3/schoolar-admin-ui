<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit professor' : 'Add new professor'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input
          label="Name"
          type="text"
          :v="$v.name"
          placeholder="John"
          v-model="name"
        />
        <base-input
          label="Surname"
          type="text"
          :v="$v.surname"
          placeholder="Doe"
          v-model="surname"
        />
        <base-input
          label="Email"
          type="text"
          :v="$v.email"
          placeholder="example@ie.ase.ro"
          v-model="email"
        />
        <base-input
          label="Title"
          type="text"
          :v="$v.title"
          placeholder="Ph.D."
          v-model="title"
        />
        <base-input
          label="Telephone"
          type="text"
          :v="$v.telephone"
          placeholder="+40765444222"
          v-model="telephone"
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
  name: 'professor-modal',
  data: () => ({
    name: '',
    surname: '',
    title: '',
    userId: '',
    telephone: '',
    email: ''
  }),
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  mounted() {
    if (this.id) {
      const professor = this.professorQuery(this.id);
      this.name = professor.name;
      this.surname = professor.surname;
      this.email = professor.email;
      this.title = professor.title;
      this.telephone = professor.telephone;
      this.userId = professor.userId;
    }
  },
  computed: {
    ...mapState('Modal', ['modalOpen', 'modalComponent']),
    ...mapGetters({
      professorQuery: 'entities/professors/find'
    })
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    ...mapActions('Professor', ['postProfessor', 'updateProfessor']),
    modalCloseAction() {
      this.modalClose();
    },
    submitMethod() {
      if (!this.$v.$invalid) {
        const object = {
          name: this.name,
          surname: this.surname,
          email: this.email,
          title: this.title,
          telephone: this.telephone
        };
        if (this.id) {
          this.updateProfessor({
            id: this.id,
            object: { ...object, userId: this.userId }
          });
        } else {
          this.postProfessor({ ...object });
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
    surname: {
      required
    },
    email: {
      required
    },
    title: {
      required
    },
    telephone: {
      required
    }
  }
};
</script>
