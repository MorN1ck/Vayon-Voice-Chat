<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const isModal = ref(false)


</script>
<template>
 <main>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xl-4"></div>
      <div class="col-xl-4"><router-view/></div>
      <div class="supportAuthor" v-show="isModal">
        <transition name="fadeWindow">
          <div class="window" v-show="isModal">
            <div class="windowHeader d-flex position-relative flex-row justify-content-center align-items-center w-100 ">
              <h3 class="text-white mt-4">Поддержать автора</h3>
              <svg @click="isModal = !isModal" class="position-absolute top-0 end-0 me-2 mt-2" width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#ffffff"></path> </g></svg>
            </div>
            <div class="payBox d-flex flex-column justify-content-center align-items-center w-100 h-100">
              <p class="text-white">Пока тут пусто 😅</p>
            </div>
          </div>
        </transition>
      </div>
      <div class="col-xl-4"></div>
    </div>
  </div>
</main>
<footer>
  <div class="block d-flex flex-row justify-content-center">
    <p class="footer" @click="isModal = !isModal">Поддержать автора</p>
    <p style="margin: 0px 5px;">|</p>
    <a class="footer text-decoration-none" href="/privacy-policy" target="_blank" rel="noopener noreferrer"><p>Политика конфиденциальности</p></a>
  </div>
  <p>©2025 VAYON</p>
</footer>
</template> 

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Bayon&display=swap");
.fadeWindow-enter-active,
.fadeWindow-leave-active {
  animation: fade-in 0.5s ease-out;
}
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

main{
  height: 90vh;
  width: 100%;
  background-color: black;
}

footer{
  height: 10vh;
  width: 100%;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
footer p{
  color: white;
  cursor: pointer;
  font-size: clamp(0.7rem, 1.5vw, 0.9rem);
}

.footer:hover{
  text-shadow: 0px 5px 5px white;
  transition: all 0.2s ease-in-out
}
.supportAuthor{
  background-color:  rgba(0, 0, 0, 0.8);
  position: absolute;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.window{
  width: 50%;
  height: 50%;
  background-color: rgb(0, 0, 0);
  box-shadow: white 0px 0px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  opacity: 0.9;
}
.window svg{
  cursor: pointer;
}
@media screen and (max-width: 768px) {
  .window{
    width: 80%;
    height: 80%;
  }
}
@media screen and (max-height: 600px) {
  main{
    height: 100vh;
  }
}
@media (max-height: 430px) {
  main{
    height: 130vh;
  }
}
</style>