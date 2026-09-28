<template>
  <div class="wrap">-</div>
</template>

<script>
export default {
  name: "Agree",
  props: {},
  components: {},
  mounted() {
    var callbackFuc = async () => {
      //네이버 로그인 인증 코드 (nodejs api)
      await window.callback
        .naver(this.$route.query.code, this.$route.query.state)
        .then((data) => {
          this.authArry = data;
        })
        .catch((error) => {
          console.log(error);
          this.descript =
            "이용에 불편을 드려 죄송합니다. 빠른 조치중에 있습니다.";
          this.title = "서버에러";
          this.modalShow = true;
        });
    };
    callbackFuc();
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
