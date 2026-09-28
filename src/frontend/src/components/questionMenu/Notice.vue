<template>
  <div class="wrap">
    <header class="header">
      <button type="button" class="btn btn-back" @click="goBack"></button>
      <h2 class="header-tit">공지사항</h2>
    </header>
    <div class="content">
      <ul class="text-list">
        <li
          class="text-list--item"
          v-for="item in itemList"
          v-bind:key="'noti_' + item.NoticeId"
          v-bind:class="{
            new: nowDate == $date(item.NoticeCreatedAt).format('YYYY.MM.DD'),
          }"
        >
          <router-link
            :to="{ name: 'NoticeDetail', query: { id: item.NoticeId } }"
            tag="a"
            class="menu-list--item"
          >
            <strong class="tit">{{ item.NoticeTitle }}</strong>
            <span class="date"
              >{{ $date(item.NoticeCreatedAt).format("YYYY") }}년
              {{ $date(item.NoticeCreatedAt).format("MM") }}월
              {{ $date(item.NoticeCreatedAt).format("DD") }}일</span
            >
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Notice",
  props: {
    msg: String,
  },
  components: {},
  data() {
    return { page: 1, itemList: [], nowDate: null };
  },
  created() {
    this.nowDate = new Date();
    this.nowDate = this.$date(this.nowDate).format("YYYY.MM.DD");
  },
  mounted() {
    this.getItems();
  },
  methods: {
    getItems() {
      this.$apiGET("/notices?page=" + this.page).then(({ data }) => {
        if (data.code === 200) {
          this.itemList = data.d;
        }
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
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
