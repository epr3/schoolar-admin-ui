<template>
  <base-modal-content :modal-title="modalTitle" :modal-close-action="modalCloseAction">
    <template #modal-footer>
      <base-button type="success" @click="modalSuccessAction">Yes</base-button>
      <base-button type="danger" @click="modalCloseAction">No</base-button>
    </template>
  </base-modal-content>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import BaseModalContent from './BaseModalContent.vue';
import BaseButton from './BaseButton.vue';

@Component({
  components: {
    BaseModalContent,
    BaseButton
  }
})
export default class ConfirmationModal extends Vue {
  @Prop({ required: true, type: String }) private readonly modalTitle!: string;
  @Prop({ required: true, type: Function }) private readonly modalCloseAction!: any;
  @Prop({ required: true, type: Function }) private readonly modalSuccessAction!: any;
}
</script>

