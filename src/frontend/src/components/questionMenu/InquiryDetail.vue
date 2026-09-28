<template>
  <div class="wrap">
    <header class="header">
      <button type="button" class="btn btn-back" @click="goBack"></button>
      <h2 class="header-tit">1:1 문의</h2>
    </header>
    <div class="content">
      <div class="inquiry-wrap q">
        <div class="mark">Q</div>
        <div class="grey">
          {{ $date(item.CreatedAt).format("YYYY") }}년
          {{ $date(item.CreatedAt).format("MM") }}월
          {{ $date(item.CreatedAt).format("DD") }}일
        </div>
        <div class="con">
          {{ item.Title }}
        </div>
      </div>
      <div class="inquiry-wrap a" v-if="item.IsAnswered">
        <div class="mark">A</div>
        <div class="grey">답변완료</div>
        <div class="con">
          {{ item.Content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InquiryDetail",
  props: {},
  components: {},
  data() {
    return {
      item: {
        IsAnswered: false,
        Content: "",
        CreatedAt: "",
        Title: "",
      },
    };
  },
  created() {
    this.getItem();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getItem() {
      this.$apiGET("/qna?qnaid=" + this.$route.query.id).then(({ data }) => {
        this.item = data.d;
      });
    },
  },
};
</script>
