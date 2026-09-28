<template>
  <div class="wrap">
    <header class="header">
      <button class="btn btn-back" @click="btnBack"></button>
      <h2 class="header-tit">문의하기</h2>
    </header>
    <div class="content">
      <div class="form-wrap">
        <label class="label">이름</label>
        <input
          type="text"
          placeholder="이름을 작성해주세요."
          class="input-text"
          v-model="UserName"
          ref="userName"
          @keydown="keyState"
        />
      </div>
      <div class="form-wrap">
        <label class="label">연락처</label>
        <input
          type="tel"
          placeholder="- 빼고 입력해주세요."
          class="input-text"
          v-model="Contact"
          ref="contact"
          @keydown="keyState"
        />
      </div>
      <div class="form-wrap">
        <label class="label">목적</label>
        <select class="input-select" v-model="Type" @change="keyState">
          <option value="-1">선택</option>
          <option value="주택담보대출">주택담보대출</option>
          <option value="전세퇴거대출">전세퇴거대출</option>
          <option value="기타">기타</option>
        </select>
      </div>
      <div class="form-wrap">
        <label class="label">가용 자기자본</label>
        <!-- <span class="fix-text">{{ $numberToKorean(AvailableAmount) }}</span> -->
        <span class="fix-text">만원</span>
        <input
          type="tel"
          class="input-text text-right"
          @keyup="setMount"
          ref="availableAmount"
          @keydown="keyState"
        />
        <p class="font-color--l-grey text-right">
          {{ $numberToKorean(AvailableAmount) }}
        </p>
      </div>
      <div class="form-wrap">
        <label class="label">내용</label>
        <textarea
          placeholder="문의하실 내용을 작성해주세요."
          rows="10"
          class="textarea"
          v-model="Title"
          ref="title"
          @keydown="keyState"
        ></textarea>
      </div>
      <button
        class="btn btn-full btn-gradient"
        @click="btnSend"
        :disabled="!state"
      >
        등록
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateInquiry",
  created() {
    // console.log(this.$props.name);
    // console.log(this.$props.age);
  },
  filters: {
    comma(val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  props: {
    name: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      UserName: "",
      Title: "",
      Contact: "",
      Type: "-1",
      AvailableAmount: null,
      state: false,
    };
  },
  methods: {
    btnBack() {
      this.$router.go(-1);
    },
    btnSend() {
      // this.$apiPOST("/review", {
      //   UserId: this.reviewItem.UserId,
      //   ApartmentId: this.reviewItem.ApartmentId,
      //   OwnAmount: this.reviewItem.OwnAmount,
      //   TransactionAmount: this.reviewItem.TransactionAmount,
      //   Content: this.reviewItem.Content,
      // }).then((re) => {
      //   if (re.data.code === 200) {
      //     // this.$router.push({
      //     //   name: "ReviewMain",
      //     // });
      //     this.btnBack();
      //   } else {
      //     console.log("에러 ", re.code + " ");
      //   }
      // });

      if (this.Contact.length > 12) {
        alert("올바른 연락처를 입력해 주세요.");
        return;
      }

      this.$apiPOST("/qna", {
        Title: this.Title,
        UserName: this.UserName,
        Contact: this.Contact,
        Type: this.Type,
        AvailableAmount: this.AvailableAmount,
      }).then(({ data }) => {
        if ("code" in data && data.code == 200) {
          this.$router.go(-1);
        }
      });
    },
    keyState() {
      if (
        this.$refs.userName.value.length > 0 &&
        this.$refs.title.value.length > 0 &&
        this.$refs.contact.value.length > 0 &&
        this.$refs.availableAmount.value.length > 0 &&
        this.Type != "-1"
      ) {
        this.state = true;
      } else {
        this.state = false;
      }
    },
    setMount(e) {
      let value = e.target.value;
      value = Number(value.replaceAll(",", ""));
      if (isNaN(value)) {
        //NaN인지 판별
        e.target.value = 0;
        this.AvailableAmount = 0;
      } else {
        //NaN이 아닌 경우
        const formatValue = value.toLocaleString("ko-KR");
        e.target.value = formatValue;
        this.AvailableAmount = Number(e.target.value.replaceAll(",", ""));
      }
    },
  },
};
</script>
