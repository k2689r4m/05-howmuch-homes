<template>
  <div class="wrap">
    <header class="header">
      <button type="button" class="btn btn-back" @click="goBack"></button>
      <h2 class="header-tit">자주 묻는 질문</h2>
    </header>
    <div class="content">
      <h3 class="list-tit">서비스</h3>
      <ul class="accordion-list">
        <li class="accordion-list--item">
          <button
            type="button"
            class="btn btn-tit"
            v-bind:class="{ active: btnList[0] }"
            @click="toggleActive(0)"
          >
            Q. 하우머치 홈즈는 어떤 서비스인가요?
          </button>
          <div class="con">
            대한민국에 있는 매물이라면 모두!<br />
            아파트부터 빌라,주택, 오피스텔 등 내가 구매할 수 있는 매물을 손쉽게
            확인 가능합니다!
          </div>
        </li>
        <li class="accordion-list--item">
          <button
            type="button"
            class="btn btn-tit"
            v-bind:class="{ active: btnList[1] }"
            @click="toggleActive(1)"
          >
            Q. 하우머치 홈즈에 등록되어있는 매물은 믿을 수 있나요?
          </button>
          <div class="con">
            하우머치 홈즈는 실매매를 원하시는 분들께 믿을 수 있는 매물만
            보여드리고있습니다.<br />
            전국의 부동산 빅데이터를 기반으로 하여 실시간 매물정보를
            확인하는것은 물론! <br />
            현재 내가 살 수 있는 매물들로 종합하여 확인하실 수 있습니다.<br />
          </div>
        </li>
        <li class="accordion-list--item">
          <button
            type="button"
            class="btn btn-tit"
            v-bind:class="{ active: btnList[2] }"
            @click="toggleActive(2)"
          >
            Q. 하우머치 홈즈에서 허위매물은 어떻게 관리하나요?
          </button>
          <div class="con">
            하우머치 홈즈에서는 허위매물 전담팀을 따로 배정하여 새롭게 매물이
            올라옴과 동시에 필터링하여 관리하고있습니다.
          </div>
        </li>
        <li class="accordion-list--item">
          <button
            type="button"
            class="btn btn-tit"
            v-bind:class="{ active: btnList[3] }"
            @click="toggleActive(3)"
          >
            Q. 하우머치 홈즈는 무료로 이용이 가능한가요?
          </button>
          <div class="con">
            집을 매매하는 모든 서비스는 무료로 이용이 가능합니다.
          </div>
        </li>
      </ul>

      <h3 class="list-tit">상담하기</h3>
      <ul class="accordion-list">
        <li class="accordion-list--item">
          <button
            type="button"
            class="btn btn-tit"
            v-bind:class="{ active: btnList[4] }"
            @click="toggleActive(4)"
          >
            Q. 하우머치 홈즈 운영시간이 어떻게 되나요?
          </button>
          <div class="con">
            고객센터 영업시간 : 평일 오전 9 : 00 ~ 오후 18 : 00<br />
            고객센터 점심시간 : 평일 오후 13 : 00 ~ 오후 14 : 00<br />
            ( 영업시간 외에도 간단한 상담이 가능합니다.) <br />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Faq",
  props: {},
  components: {},
  data() {
    return {
      btnList: [false, false, false, false, false, false],
    };
  },
  methods: {
    toggleActive(idx) {
      this.btnList[idx] = !this.btnList[idx];
      this.btnList.push(false);
      this.btnList.pop();
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
