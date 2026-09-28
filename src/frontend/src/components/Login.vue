<template>
  <div class="wrap splash">
    <p class="greeting">
      내 집 장만!<br />
      하우머치 홈즈로 시작하세요!
    </p>
    <!-- <router-link :to="{ name: 'HowMain' }" tag="button" class="btn btn-login">
      로그인
    </router-link> -->
    <button class="btn btn-login" @click="login">로그인</button>
    <router-link :to="{ name: 'Join' }" tag="button" class="btn btn-review">
      간편 회원가입
    </router-link>
    <!-- <button @click="zxzx">testest</button> -->
  </div>
</template>

<script>
export default {
  name: "Login",
  props: {
    msg: String,
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.init();
    this.$nextTick(() => {
      if (this.$getAppCheck() == "android") {
        window.Android.SetWebViewVisible();
      }
    });

    if (this.$route.query.id != undefined) {
      this.$store.state.rId = this.$route.query.id;

      this.$router.push({
        name: "ReviewMain",
      });
    }
  },
  methods: {
    // zxzx() {
    //   var ddd = window.Android.showMessage("zxzxzxz");
    //   alert(ddd);
    // },
    init() {
      this.$store.commit("init");
    },
    login() {
      this.$login(null).then((re) => {
        console.log(re);
        this.$router.push({
          name: "HowMain",
        });
      });
    },
    //라우터 코드로 이동
    clickList() {
      this.$router.push({
        name: "CreateReview",
        query: { name: "Query 프로그래밍 방식", age: 2 },
      });
    },
    clickParams() {
      this.$router.push({
        name: "CreateReview",
        params: { name: "Params 프로그래밍 방식", age: 2 },
      });
    },
  },
};
</script>
