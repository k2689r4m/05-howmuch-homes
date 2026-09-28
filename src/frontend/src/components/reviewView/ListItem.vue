<template>
  <li class="review-list--item">
    <div class="top">
      <button type="button" class="btn btn-report" @click="report">신고</button>
      <strong class="tit">{{ item.ApartmentName }}</strong>
      <div class="flex-wrap">
        <div class="capital">
          <span>자기자본</span>
          <strong>{{ item.OwnAmount }}</strong>
        </div>
        <div class="trade">
          <span>거래금액</span>
          <strong>{{ item.TransactionAmount }}</strong>
        </div>
      </div>
      <span class="date">{{ $date(item.CreatedAt).format("YYYY.MM.DD") }}</span>
      <span class="name">{{ item.UserNickname }}</span>
      <p class="con">
        {{ item.Content }}
      </p>
    </div>
    <div class="bottom">
      <button
        type="button"
        class="btn btn-like"
        @click="btnLike"
        v-bind:class="{ active: this.item.IsLiked }"
      >
        <img src="../../../public/images/icon/heart.svg" />좋아요
        {{ item.LikeCount }}
      </button>
      <button type="button" class="btn btn-kakao" @click="kakaShare">
        <img src="../../../public/images/icon/kakao.svg" />카카오 공유
      </button>
      <ShareNetwork
        tag="button"
        popup.width="200"
        popup.height="200"
        class="btn btn-facebook"
        network="facebook"
        :url="'https://hmhomes.kr/install?id=' + item.Id"
        title="하우머치홈"
        description="하우머치홈"
        :quote="'[' + item.ApartmentName + '] ' + subSt(item.Content)"
      >
        <img src="../../../public/images/icon/facebook.svg" />페이스북 공유
      </ShareNetwork>
    </div>
  </li>
</template>

<script>
export default {
  name: "ListItem",
  props: {
    item: Object,
  },

  data() {
    return {
      myName: "sdfsd",
    };
  },
  methods: {
    report() {
      this.$apiPOST("/report", {
        ReviewId: this.item.Id,
      }).then(() => {
        alert("신고 접수가 완료되었습니다.");
        this.$emit("reItem");
      });
    },
    btnLike() {
      this.$apiPOST("/like", {
        ReviewId: this.item.Id,
        Type: !this.item.IsLiked,
      }).then(({ data }) => {
        if (data.code === 200) {
          if (this.item.IsLiked) {
            this.item.LikeCount--;
          } else {
            this.item.LikeCount++;
          }
          this.item.IsLiked = !this.item.IsLiked;
        }
      });
    },
    subSt(input) {
      if (input.length >= 14) {
        return input.substr(0, 14) + "...";
      } else {
        return this.item.Content;
      }
    },
    kakaShare() {
      const content = this.subSt(this.item.Content);

      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: this.item.ApartmentName,
          description: content,
          imageUrl: "https://hmhomes.kr/homes.png",
          link: {
            mobileWebUrl: "https://hmhomes.kr/install",
            webUrl: "https://hmhomes.kr/install",
            androidExecutionParams: "id=" + this.item.Id + "&method=1", //id 리뷰 아이디
            iosExecutionParams: "id=" + this.item.Id + "&method=1",
          },
        },
        social: {
          likeCount: this.item.LikeCount,
        },

        // objectType: "text",
        // text: content, //200자
        // link: {
        //   mobileWebUrl: "https://plushdev.com/install",
        //   webUrl: "https://plushdev.com/install",
        //   androidExecutionParams: "id=" + this.item.Id + "&method=1", //id 리뷰 아이디
        //   iosExecutionParams: "id=" + this.item.Id + "&method=1",
        // },

        buttons: [
          {
            title: "앱으로 이동",
            link: {
              mobileWebUrl: "https://hmhomes.kr/install",
              webUrl: "https://hmhomes.kr/install",
              androidExecutionParams: "id=" + this.item.Id + "&method=1", //id 리뷰 아이디
              iosExecutionParams: "id=" + this.item.Id + "&method=1",
            },
          },
        ],
      });
    },
  },
};
</script>
