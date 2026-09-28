<template>
  <div class="wrap">
    <!-- 약관 동의 진입 0108추가 -->
    <div class="agree-info">
      <div class="top">
        <img src="../../public/images/icon/check_lg.svg" />
        앱 약관 동의
      </div>
      <div class="box">
        앱 서비스 이용을 위해<br />
        다음과 같은 권한이 필요합니다.
      </div>
      <ul class="list">
        <li class="list-item">
          <div class="icon-wrap">
            <img src="../../public/images/icon/call2.svg" />
          </div>
          <div class="right">
            <strong>전화 권한</strong>
            <p>사용자 식별을 위한 기기 정보 획득</p>
          </div>
        </li>
        <li class="list-item">
          <div class="icon-wrap">
            <img src="../../public/images/icon/write2.svg" />
          </div>
          <div class="right">
            <strong>콘텐츠 권한</strong>
            <p>콘텐츠 확인 및 작성</p>
          </div>
        </li>
      </ul>
      <div class="agree">
        약관 및 개인정보 취급 방침
        <!-- <button type="button" class="btn">전문 보기</button> -->
        <router-link :to="{ name: 'AgreeMain' }" tag="button" class="btn">
          전문 보기
        </router-link>
      </div>
      <button class="btn btn-full btn-gradient" @click="agreeSend">동의</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Agree",
  props: {},
  components: {},
  mounted() {},
  data() {
    return {};
  },
  methods: {
    agreeSend() {
      this.$apiPOST("/agree").then(() => {
        this.$router.push({
          name: "HowMain",
        });
      });
    },
  },
};
</script>
