<template>
  <div class="wrap">
    <header class="header">
      <button type="button" class="btn btn-back" @click="goBack"></button>
      <h2 class="header-tit">내집찾기(+조건비교하기)</h2>
    </header>
    <div class="content bg-grey">
      <ul class="ratio-list">
        <li
          class="ratio-list--item"
          v-for="(info, idx) in infoList"
          :key="'info_' + info.Id"
          @click="goMap(idx)"
        >
          <button
            v-if="info.IsOrigin != 1"
            type="button"
            class="btn btn-delete"
            @click.stop="btnDelHome(info.Id, idx)"
          >
            &times;
          </button>
          <label>
            <span class="font-color--primary">
              {{
                info.LoanRate == null ? "[미입력]" : info.LoanRate + "%"
              }} </span
            >대출비율
          </label>
          <div class="info" v-if="info.AvailableAmount == null">
            <div>
              <strong>[미입력] </strong>
              <div>
                <span>자기자본</span>
              </div>
            </div>
            <div><strong> [미입력] </strong><span>대출 금액</span></div>
            <div><strong> [미입력] </strong><span>거래 가능 금액</span></div>
          </div>
          <div class="info" v-else>
            <div>
              <strong>{{ $numberToKorean2(info.AvailableAmount) }} </strong>
              <div>
                <span>자기자본</span>
              </div>
            </div>
            <div>
              <strong>
                {{
                  info.LoanRate > 0
                    ? $numberToKorean2(
                        Math.ceil(
                          info.AvailableAmount / (1 - info.LoanRate * 0.01)
                        ) - info.AvailableAmount
                      )
                    : "0원"
                }} </strong
              ><span>대출 금액</span>
            </div>
            <div>
              <strong>
                {{
                  $numberToKorean2(
                    Math.ceil(info.AvailableAmount / (1 - info.LoanRate * 0.01))
                  )
                }} </strong
              ><span>거래 가능 금액</span>
            </div>
          </div>
        </li>
      </ul>
      <button
        type="button"
        class="btn btn-full btn-gradient"
        @click="goSetHome"
      >
        + 새 조건 추가하기
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "FindMyHome",
  props: {},
  components: {},
  mounted() {},
  created() {
    this.getInfo();
    this.$store.commit("init");
  },
  data() {
    return {
      infoList: [],
    };
  },
  methods: {
    goMap(idx) {
      if (this.infoList[idx].AvailableAmount != null) {
        this.$apiPOST("/setting/home", {
          MyHomeId: this.infoList[idx].Id,
        }).then(({ data }) => {
          if (data.code == 200) {
            this.$router.push({
              name: "MapMain",
            });
          }
        });
      }
    },
    btnDelHome(homeId, idx) {
      this.$apiPOST("/myhome/delete", { MyHomeId: homeId }).then(({ data }) => {
        if (data.code === 200) {
          this.infoList.splice(idx, 1);
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    getInfo() {
      this.$apiGET("/myPage/mInfo").then(({ data }) => {
        this.infoList = data.d;
      });
    },
    goSetHome() {
      var cn = 0;
      for (let i = 0; i < this.infoList.length; i++) {
        if (this.infoList[i].IsOrigin != 1) {
          cn++;
        }
      }

      if (cn < 3) {
        this.$router.push({
          name: "SetMyHome",
          query: { st: 1 },
        });
      } else {
        alert("추가는 최대 3개까지 가능합니다.");
      }
    },
  },
};
</script>
