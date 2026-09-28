<template>
  <div class="wrap">
    <header class="header">
      <button type="button" class="btn btn-back" @click="goBack"></button>
      <h2 class="header-tit">상담 신청 내역</h2>
    </header>
    <div class="content">
      <ul class="text-list accordion border m-t--0">
        <li
          class="text-list--item"
          v-for="item in items"
          v-bind:key="'qna_' + item.Id"
        >
          <button
            type="button"
            class="btn btn-tit"
            v-bind:class="{ com: item.IsEnd == 1 }"
          >
            <strong class="tit"
              >[{{ item.TransactionType }}] {{ item.CityName }}
              {{ item.CountyName }}
              {{ $numberToKorean2(item.AvailableAmount) }}
              {{ item.ApartmentName }}
            </strong>
            <div>
              <span class="date">
                {{ $date(item.CreatedAt).format("YYYY") }}년
                {{ $date(item.CreatedAt).format("MM") }}월
                {{ $date(item.CreatedAt).format("DD") }}일
              </span>

              <span v-if="item.IsEnd == 1" class="state">상담완료</span>
              <span v-else class="state">상담대기</span>
            </div>
          </button>
          <!-- <div
            v-if="item.Content != null"
            v-html="item.Content.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            class="con"
          ></div> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "InquiryHistory",
  props: {},
  components: {},
  data() {
    return {
      page: 1,
      items: [],
    };
  },
  created() {
    this.getItem();
  },
  methods: {
    toggleActive(idx) {
      this.btnList[idx] = !this.btnList[idx];
      this.btnList.push(false);
      this.btnList.pop();
    },
    getItem() {
      this.$apiGET("/consults").then(({ data }) => {
        this.items = data.d;
      });
    },
    infiniteHandler($state) {
      console.log("itemcount:" + this.itemCount);
      console.log("page:" + this.page * 10);
      this.$apiGET("/qnas?page=" + this.page).then(({ data }) => {
        if (data.code === 200) {
          if (data.d.length) {
            this.page++;
            for (let i = 0; i < data.d.length; i++) {
              data.d[0].isFlag = false;
            }
            this.items.push(...data.d);
            $state.loaded();
          } else {
            $state.complete();
          }

          // if (this.itemCount < this.page * 10) {
          //   console.log("true");
          //   $state.loaded();
          // } else {
          //   console.log("false");
          //   $state.complete();
          // }
        } else {
          $state.complete();
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    goDetail(id) {
      this.$router.push({
        name: "InquiryDetail",
        query: { id: id },
      });
    },
  },
};
</script>
