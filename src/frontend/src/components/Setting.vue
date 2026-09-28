<template>
  <div class="wrap">
    <header class="header">
      <button type="button" class="btn btn-back" @click="goBack"></button>
      <h2 class="header-tit">설정</h2>
    </header>
    <div class="content bg-grey">
      <ul class="set-list">
        <router-link :to="{ name: 'Bookmark' }" tag="li" class="set-list--item">
          <img src="../../public/images/icon/star_line.svg" alt="" />
          즐겨찾기
        </router-link>
        <li class="set-list--item">
          <img src="../../public/images/icon/filter.svg" alt="" />
          조건 비교하기
          <div class="check-list">
            <label
              v-for="(home, idx) in homes"
              class="check"
              :key="'home_' + home.Id"
            >
              <input
                type="radio"
                name="rach"
                :checked="home.IsUse == 1"
                @change="checkChage(home.Id)"
              />
              <span>
                <img src="../../public/images/icon/check.svg" alt="" />
                <strong>{{ home.PropertyType }}</strong>
                {{ $numberToKorean2(home.AvailableAmount) }}
              </span>
              <button
                v-if="home.IsOrigin != 1"
                type="button"
                class="btn delete"
                @click="btnDelHome(home.Id, idx)"
              ></button>
            </label>
          </div>
          <ul class="input-list" v-if="homes.length > 0">
            <li class="input-list--item">
              <label>가용 금액</label>
              <span>
                {{ $numberToKorean2(homes[tgIdx].AvailableAmount) }}
              </span>
            </li>
            <li class="input-list--item">
              <label>대출 비율</label>
              <span> {{ homes[tgIdx].LoanRate }}% </span>
            </li>
            <!-- <li class="input-list--item">
              <label>신용 점수</label>
              <span>
                {{ homes[tgIdx].CreditScore }}
              </span>
            </li> -->
            <li class="input-list--item">
              <label>거래 유형</label>
              <span>
                {{ homes[tgIdx].TransactionType }}
              </span>
            </li>
            <li class="input-list--item">
              <label>매물 유형</label>
              <span>
                {{ homes[tgIdx].PropertyType }}
              </span>
            </li>
            <li class="input-list--item">
              <label>관심 지역</label>
              <span>
                {{ homes[tgIdx].CityName }}({{ homes[tgIdx].CountyName }})
              </span>
            </li>
          </ul>
        </li>
        <!-- <router-link
          :to="{ name: 'SetMyHome' }"
          tag="li"
          class="set-list--item"
        >
          <img src="../../public/images/icon/plus.svg" alt="" />
          맞춤 설정 추가
        </router-link> -->
        <li class="set-list--item" @click="goSetHome">
          <img src="../../public/images/icon/plus.svg" alt="" />
          맞춤 설정 추가
        </li>
        <!-- <li class="set-list--item">
          <img src="../../public/images/icon/write.svg" alt="" />
          내 집 마련 후기
        </li> -->
        <!-- <router-link
          :to="{ name: 'ReviewMain' }"
          tag="li"
          class="set-list--item"
        >
          <img src="../../public/images/icon/write.svg" alt="" />
          내 집 마련 후기
        </router-link> -->
        <li class="set-list--item" @click="goReview">
          <img src="../../public/images/icon/write.svg" alt="" />
          내 집 마련 후기
        </li>
        <li class="set-list--item" @click="sendConsult">
          <img src="../../public/images/icon/call.svg" alt="" />
          상담하기
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Setting",
  props: {
    msg: String,
  },
  components: {},
  data() {
    return { homes: [], tgIdx: 0 };
  },
  updated() {
    // console.log(this.checkedList);
  },
  mounted() {
    this.getSetting();
  },
  methods: {
    goSetHome() {
      var cn = 0;
      for (let i = 0; i < this.homes.length; i++) {
        if (this.homes[i].IsOrigin != 1) {
          cn++;
        }
      }

      if (cn < 3) {
        this.$router.push({
          name: "SetMyHome",
          query: { st: 0 },
        });
      } else {
        alert("추가는 최대 3개까지 가능합니다.");
      }
    },
    btnDelHome(homeId, idx) {
      this.$apiPOST("/myhome/delete", { MyHomeId: homeId }).then(({ data }) => {
        if (data.code === 200) {
          this.homes.splice(idx, 1);
        }
      });
    },
    goReview() {
      this.$router.replace({
        name: "ReviewMain",
      });
    },
    sendConsult() {
      this.$apiPOST("/consult").then(({ data }) => {
        if (data.code === 200) {
          alert("담당자 배정 후 상담 안내드리겠습니다.");
        }
      });
    },
    checkChage(id) {
      for (let i = 0; i < this.homes.length; i++) {
        if (this.homes[i].Id == id) {
          this.$apiPOST("/setting/home", {
            MyHomeId: this.homes[i].Id,
          }).then(({ data }) => {
            if (data.code == 200) {
              // this.homes[i].IsUse = !this.homes[i].IsUse;
              this.settingRe();
              this.tgIdx = i;
            } else {
              // this.homes = [];
              // this.getSetting();
            }
          });
          break;
        }
      }
    },
    getSetting() {
      this.$apiGET("/setting/homes").then(({ data }) => {
        if (data.code === 200) {
          this.homes = data.d;
          for (let i = 0; i < this.homes.length; i++) {
            if (this.homes[i].IsUse == 1) {
              this.tgIdx = i;
              break;
            }
          }
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },

    settingRe() {
      let st = false;
      for (let i = 0; i < this.homes.length; i++) {
        if (this.homes[i].IsUse == 1 || this.homes[i].IsUse == true) {
          st = true;
          break;
        }
      }

      if (st) {
        this.$apiGET("/map/info").then(({ data }) => {
          if (data.code === 200) {
            this.$store.state.AvailableAmount = data.d.AvailableAmount;
            this.$store.state.LoanRate = data.d.LoanRate;
            this.$store.state.lat = data.d.dvsn.Lat;
            this.$store.state.lng = data.d.dvsn.Lng;

            this.mapOptions.lat = this.$store.state.lat;
            this.mapOptions.lng = this.$store.state.lng;
            this.AvailableAmount = this.$store.state.AvailableAmount;
            this.loan = this.$store.state.LoanRate;
          }
        });
      } else {
        this.$store.commit("init");
      }
    },
  },
};
</script>
