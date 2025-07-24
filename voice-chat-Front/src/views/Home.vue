<script setup>
import { onMounted, ref } from 'vue';
// import { axios } from 'axios';
import { useRouter } from 'vue-router';
import { socket } from '../socket';
import { on } from 'events';

const router = useRouter();

const username = ref('');
const roomCode = ref('');
const isWelcome = ref(false);
const onClickToggle = ref(false);
const isError = ref(false);

const createRoom = () => {
    if(username.value == '') return isError.value = 'create';
    else{
        socket.emit('createRoom', username.value);
        socket.on('roomCreated', (code) => {
            localStorage.setItem('username', username.value);
            router.push(`/room/${code}`);
        })
    } 
}
const joinRoom =  () => {
    if(onClickToggle.value == false) return onClickToggle.value = true;
    if(username.value == '' || roomCode.value == '') return isError.value = 'join';
    else{ 
        socket.emit('joinRoom', {username: username.value, roomCode: roomCode.value});
        socket.on('userPush', (roomCode) => {
            localStorage.setItem('username', username.value);
            router.push(`/room/${roomCode}`);
        })
        socket.on('roomNotFound', () => {
            isError.value = 'notFound';
        })
        socket.on('roomFull', () => {
            isError.value = 'roomFull';
        })
    }
}
onMounted(() => {
    setTimeout(() => {
      isWelcome.value = true  
    }, 300)   
})
</script>

<template>
    <transition name="fade">
        <div v-if="isWelcome">
            <div class="header"><h1>VAYON</h1></div>
            <div class="main">
               <h1 style="font-size: clamp(2rem, 2vw, 3rem);">Добро пожаловать</h1>
               <div class="info d-flex flex-column align-items-center pt-3 pb-3">
                    <h5>VAYON</h5>
                    <p>- это платформа для одноразового</p>
                    <p>голосового общения.</p>
                    <p>Без регистрации, без входа, без хранения данных.</p>
                    <p>Просто создай комнату (до 5 чел) — и общайся.</p>
                    <p>Удобно. Быстро. Анонимно.</p>
                </div>
                <input type="text" placeholder="Введите ваше имя" v-model="username">
                <transition name="fade-input">
                    <input type="text" v-if="onClickToggle" placeholder="Код комнаты" v-model="roomCode">
                </transition>
                <div class="buttons">
                    <button @click="createRoom">Создать</button>
                    <button @click="joinRoom">Войти</button>
                </div>
            </div>
        </div>
    </transition>
    
    <div class="errBg" v-if="isError == 'create' || isError == 'join' || isError == 'notFound' || isError == 'roomFull'">
        <transition name="fadeModal">
            <div class="errModal">
                <div class="err" v-show="isError == 'create'">
                    <p>Введите ваше имя</p>
                </div>
                <div class="err" v-show="isError == 'join'">
                    <p>Введите ваше имя и код комнаты</p>
                </div>
                <div class="err" v-show="isError == 'notFound'">
                    <p>Комната не найдена</p>
                </div>
                <div class="err" v-show="isError == 'roomFull'">
                    <p>Комната заполнена</p>
                </div>
                <button @click="isError = false">ОК</button>
            </div>
        </transition>
    </div>
    
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  animation: fade-in 0.5s ease-out;
}
.fade-input-enter-active,
.fade-input-leave-active {
    animation: fade-in 0.5s ease-out;
}
.fadeModal-enter-active,
.fadeModal-leave-active {
    animation: fade-in 0.5s ease-out;
}
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.header{
    height: auto;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5% 0%;
}
.header h1{
    font-family: "Bayon", sans-serif;
    font-weight: 400;
    font-style: normal;
    color: white;
    font-size: clamp(50px, 4vw, 64px);
}
.main{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 78vh;
    width: 100%;
    color: white;
    flex-direction: column
}
.info p, h5{
    font-size: clamp(0.85rem, 1.3vw, 1rem);
    margin: 0;
    padding: 0;
}
.main input{
    width: clamp(230px, 30vw, 300px);
    height: 50px;
    border-radius: 20px;
    padding: 20px;
    outline: none;
    border: none;
    margin: 5px 0px;
}
.buttons button{
    width: clamp(7rem, 13vw, 9.1rem); 
    height: 50px;
    border-radius: 20px;
    font-weight: bold;
    color: black;
}
.buttons button:hover{
    background-color: rgba(255, 255, 255, 0.822);
    transition: all 0.2s ease-in-out;
}
.errBg{
    background-color: rgba(0, 0, 0, 0.801);
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
}
.errModal{
    position: relative;
    width: 30%;
    height: 30%;
    background-color: rgb(0, 0, 0);
    box-shadow: white 0px 0px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 10px 20px;
    opacity: 0.9;
}
.errModal button{
    position: absolute;
    bottom: 10px;
    width: 90%; 
    height: auto;
    border-radius: 20px;
    font-weight: bold;
    color: black;
    padding: 10px 20px;
    font-size: clamp(0.7rem, 1.5vw, 0.9rem);
}
.errModal button:hover{
    background-color: rgba(255, 255, 255, 0.822);
    transition: all 0.2s ease-in-out;
}
.err{
    color: white;
    font-size: clamp(0.7rem, 1.5vw, 0.9rem);
}
@media screen and (max-width: 768px) {
    .errModal{
        width: 70%;
        height: 30%;
    } 
}
@media screen and (max-height: 600px) {
    .errBg{
        height: 110vh;
    }
}
@media screen and (max-height: 430px) {
    .errBg{
        height: 140vh;
    }
 
}
</style>
