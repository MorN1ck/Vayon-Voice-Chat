<script setup>
import { ref } from 'vue';
// import { axios } from 'axios';
import { useRouter } from 'vue-router';
import { socket } from '../socket';

const router = useRouter();

const username = ref('');
const roomCode = ref('');

const createRoom = () => {
    if(username.value == '') return alert('Введите ваше имя (для теста дальше добавь стиль)');
    else{
       socket.emit('createRoom', username.value);
       socket.on('roomCreated', (code) => {
           router.push(`/room/${code}`);
       })
    } 
}
const joinRoom =  () => {
    if(username.value == '' || roomCode.value == '') return alert('Введите ваше имя (для теста дальше добавь стиль)');
    else{
        socket.emit('joinRoom', {username: username.value, roomCode: roomCode.value});
        socket.on('userPush', (roomCode) => {
            router.push(`/room/${roomCode}`);
        })
        socket.on('roomNotFound', () => {
            alert('Комната не найдена');
        })
    }
}
</script>

<template>
    <div class="mid col-md-4">
        <div class="header"><h1>VAYON</h1></div>
        <div class="main">
            <h1>Добро пожаловать</h1>
            <div class="info d-flex flex-column align-items-center pt-3 pb-3">
                <p>VAYON</p>
                <p>- это платформа для одноразового</p>
                <p>голосового общения.</p>
                <p>Без регистрации, без входа, без лишнего.</p>  
            </div>
            <input type="text" placeholder="Введите ваше имя" v-model="username">
            <input type="text" placeholder="Код комнаты" v-model="roomCode">
            <div class="buttons">
                <button @click="createRoom">Создать</button>
                <button @click="joinRoom">Войти</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
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
    font-size: 64px;
}
.main{
    display: flex;
    align-items: center;
    height: 60vh;
    width: 100%;
    color: white;
    flex-direction: column;
    padding: 30% 0%;
}
.info p{
    font-size: 20px;
    margin: 0;
    padding: 0;
}
.main input{
    width: 300px;
    height: 50px;
    border-radius: 20px;
    padding: 20px;
    outline: none;
    border: none;
    margin: 5px 0px;
}
.buttons button{
    width: 130px;
    height: 50px;
    border-radius: 20px;
    font-weight: bold;
}
</style>
