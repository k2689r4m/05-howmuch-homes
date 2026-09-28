<template>
  <div class="wrap">
    <header class="header">
      <button type="button" class="btn btn-back" @click="goBack"></button>
      <h2 class="header-tit"></h2>
    </header>
    <div class="content">
      <div class="board-detail">
        <template v-if="item != null">
          <h3 class="tit">{{ item.Title }}</h3>
          <span class="date">
            {{ $date(item.CreatedAt).format("YYYY") }}년
            {{ $date(item.CreatedAt).format("MM") }}월
            {{ $date(item.CreatedAt).format("DD") }}일
          </span>
        </template>
        <div
          v-if="item != null"
          v-html="item.Content.replace(/(?:\r\n|\r|\n)/g, '<br />')"
          class="con"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HowMain",
  props: {
    msg: String,
  },
  components: {},
  data() {
    return { item: null };
  },
  created() {
    this.getItems();
  },
  methods: {
    getItems() {
      this.$apiGET("/notice?noticeId=" + this.$route.query.id).then(
        ({ data }) => {
          if (data.code === 200) {
            this.item = data.d[0];
          }
        }
      );
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
