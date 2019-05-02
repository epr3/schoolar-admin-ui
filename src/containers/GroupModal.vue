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

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  name: 'group-modal',
  data: () => ({
    number: '',
    year: ''
  }),
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  mounted() {
    if (this.id) {
      const group = this.groupQuery(this.id);
      this.number = group.number;
      this.year = group.year;
    }
  },
  mixins: [validationMixin],
  components: {
    BaseModalContent,
    BaseButton,
    BaseInput
  },
  computed: {
    ...mapState('Modal', ['modalOpen', 'modalComponent']),
    ...mapGetters({
      groupQuery: 'entities/groups/find'
    })
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    ...mapActions({
      postGroup: 'Group/postGroup',
      updateGroup: 'Group/updateGroup'
    }),
    modalCloseAction() {
      this.modalClose();
    },
    submitMethod() {
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
  },
  validations: {
    number: {
      required
    },
    year: {
      required
    }
  }
};
</script>
