<template>
  <div
    class="question-menu"
    v-bind:class="{ active: btnState, right: menuState }"
  >
    <div class="dim" @click="setState"></div>
    <ul class="menu-list">
      <router-link :to="{ name: 'Notice' }" tag="li" class="menu-list--item">
        <img src="../../public/images/icon/notice.svg" alt="" />
        공지사항
      </router-link>
      <router-link :to="{ name: 'Faq' }" tag="li" class="menu-list--item">
        <img src="../../public/images/icon/chat.svg" alt="" />
        자주 묻는 질문
      </router-link>
      <router-link :to="{ name: 'Inquiry' }" tag="li" class="menu-list--item">
        <img src="../../public/images/icon/list.svg" alt="" />
        1:1 문의
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Inquiry",
  props: { btnState: Boolean, menuState: Boolean },
  components: {},
  data() {
    return {};
  },
  methods: {
    setState() {
      this.$emit("setState", false);
    },
  },
};
</script>
