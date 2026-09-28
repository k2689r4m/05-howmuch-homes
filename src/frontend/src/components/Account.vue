<template>
  <div class="wrap">
    <header class="header">
      <button type="button" class="btn btn-back" @click="goBack"></button>
      <h2 class="header-tit">계정 관리</h2>
    </header>
    <div class="content bg-grey">
      <ul class="set-list type2">
        <li class="set-list--item">
          전화번호 변경
          <div class="right">
            <input type="text" class="text" v-model="Contact" />
            <button
              type="button"
              class="btn btn-primary btn-md"
              @click="btnEdit"
            >
              수정
            </button>
          </div>
        </li>
        <li class="set-list--item">
          알람 설정
          <div class="right">
            <label class="switch">
              <input type="checkbox" v-model="IsNoti" @change="tnNoti" />
              <span></span>
            </label>
          </div>
        </li>
        <li class="set-list--item">
          <button type="button" class="btn arrow" @click="logout">
            로그아웃
          </button>
        </li>
        <li class="set-list--item" @click="btnSecession">
          <button type="button" class="btn arrow">탈퇴</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Account",
  props: {},
  components: {},
  mounted() {},
  data() {
    return {
      Contact: "",
      IsNoti: false,
    };
  },
  created() {
    this.getMyinfo();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    logout() {
      this.$logout();
      this.$router.push({
        name: "Login",
      });
      this.$router.go();
    },
    getMyinfo() {
      this.$apiGET("/myPage/myInfo").then(({ data }) => {
        if (data.code === 200) {
          this.Contact = data.d.Contact;
          this.IsNoti = data.d.IsNoti;
        }
      });
    },
    btnEdit() {
      alert("전화번호 변경은 홈즈조회에서 변경해 주시길 바랍니다.");
    },
    tnNoti() {
      this.$apiPOST("/myPage/noti", { IsNoti: this.IsNoti }).then(() => {});
    },
    btnSecession() {
      if (window.confirm("정말로 탈퇴를 진행하시겠습니까?")) {
        this.$apiPOST("/myPage/secession").then(() => {
          this.logout();
        });
      } else {
        console.log("취소");
      }
    },
  },
};
</script>
