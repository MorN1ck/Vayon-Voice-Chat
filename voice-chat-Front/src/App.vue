<script setup>
import { RouterView } from 'vue-router'
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');


</script>
<template>
 <main>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4"></div>
      <router-view/>
      <div class="col-md-4"></div>
    </div>
  </div>
</main>
<footer>
  <p>Поддержать автора</p>
  <p>©2025 VAYON</p>
</footer>
</template> 

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Bayon&display=swap");
main{
  height: 100vh;
}
main, footer{
  width: 100%;
  background-color: black;
}
footer{
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
footer p{
  color: white;
}
</style>