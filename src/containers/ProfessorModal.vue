<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit professor' : 'Add new professor'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input label="Name" type="text" :v="$v.name" placeholder="John" v-model="name"/>
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
        <base-input label="Title" type="text" :v="$v.title" placeholder="Ph.D." v-model="title"/>
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

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Mutation, Action, Getter } from 'vuex-class';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

@Component({
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
})
export default class ProfessorModal extends Vue {
  private name = '';
  private surname = '';
  private email = '';
  private title = '';
  private telephone = '';
  private userId = '';
  @State('modalOpen', { namespace: 'Modal' }) private modalOpen: any;
  @State('modalComponent', { namespace: 'Modal' }) private modalComponent: any;
  @Mutation('CLOSE_MODAL', { namespace: 'Modal' }) private modalClose: any;
  @Prop({ type: String, default: '' }) private id: any;
  @Action('postProfessor', { namespace: 'Professor' })
  private postProfessor: any;
  @Action('updateProfessor', { namespace: 'Professor' })
  private updateProfessor: any;
  @Getter('professors/find', { namespace: 'entities' })
  private professorQuery: any;

  private mounted() {
    if (this.id) {
      const professor = this.professorQuery(this.id);
      this.name = professor.name;
      this.surname = professor.surname;
      this.email = professor.email;
      this.title = professor.title;
      this.telephone = professor.telephone;
      this.userId = professor.userId;
    }
  }

  private modalCloseAction() {
    this.modalClose();
  }

  private submitMethod() {
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
}
</script>

