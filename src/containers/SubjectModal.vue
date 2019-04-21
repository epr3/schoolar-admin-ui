<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit group' : 'Add new group'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input label="Name" type="text" :v="$v.name" placeholder="Something" v-model="name"/>
        <base-input label="Credits" type="number" :v="$v.credits" placeholder="1" v-model="credits"/>
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
    credits: {
      required
    }
  }
})
export default class GroupModal extends Vue {
  private name = '';
  private credits = 0;
  @State('modalOpen', { namespace: 'Modal' }) private modalOpen: any;
  @State('modalComponent', { namespace: 'Modal' }) private modalComponent: any;
  @Mutation('CLOSE_MODAL', { namespace: 'Modal' }) private modalClose: any;
  @Prop({ type: String, default: '' }) private id: any;
  @Action('postSubject', { namespace: 'Subject' }) private postSubject: any;
  @Action('updateSubject', { namespace: 'Subject' }) private updateSubject: any;
  @Getter('subjects/find', { namespace: 'entities' }) private subjectQuery: any;

  private mounted() {
    if (this.id) {
      const subject = this.subjectQuery(this.id);
      this.name = subject.name;
      this.credits = subject.credits;
    }
  }

  private modalCloseAction() {
    this.modalClose();
  }

  private submitMethod() {
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
}
</script>

