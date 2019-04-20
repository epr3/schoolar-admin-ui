<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit group' : 'Add new group'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-input label="Number" type="text" :v="$v.number" placeholder="1111" v-model="number"/>
        <base-input label="Year" type="text" :v="$v.year" placeholder="2M" v-model="year"/>
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
    number: {
      required
    },
    year: {
      required
    }
  }
})
export default class GroupModal extends Vue {
  private number = '';
  private year = '';
  @State('modalOpen', { namespace: 'Modal' }) private modalOpen: any;
  @State('modalComponent', { namespace: 'Modal' }) private modalComponent: any;
  @Mutation('CLOSE_MODAL', { namespace: 'Modal' }) private modalClose: any;
  @Prop({ type: String, default: '' }) private id: any;
  @Action('postGroup', { namespace: 'Group' }) private postGroup: any;
  @Action('updateGroup', { namespace: 'Group' }) private updateGroup: any;
  @Getter('groups/query', { namespace: 'entities' }) private groupQuery: any;

  private mounted() {
    if (this.id) {
      const group = this.groupQuery().find(this.id);
      this.number = group.number;
      this.year = group.year;
    }
  }

  private modalCloseAction() {
    this.modalClose();
  }

  private submitMethod() {
    if (!this.$v.$invalid) {
      const object = {
        number: this.number,
        year: this.year,
        facultyId: this.$route.params.id
      };
      if (this.id) {
        this.updateGroup({ id: this.id, object });
      } else {
        this.postGroup({ ...object });
      }
      this.modalClose();
    }
  }
}
</script>

