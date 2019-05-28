<template>
  <auth-layout>
    <faculty-list />
  </auth-layout>
</template>

<script>
import PROFILE_QUERY from '../graphql/Auth/Profile.gql';

import AuthLayout from '@/layouts/AuthLayout.vue';

import FacultyList from '@/containers/FacultyList.vue';

export default {
  name: 'home',
  data: () => ({
    profile: null
  }),
  apollo: {
    profile: PROFILE_QUERY
  },
  components: {
    AuthLayout,
    FacultyList
  }
};
</script>
