<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { socket } from '../socket';
const router = useRouter();

const userJoined = ref(false);
const username = ref('');

function onJoin(name) {
  username.value = name
  userJoined.value = true
}

onMounted(() => {
    socket.on('userJoined', (username) => {
        console.log(`${username} joined the room`);
        onJoin(username);
    });
})


</script>
<template>
    <div class="col-md-4">
        <div class="header">
            <div class="elements">
               <img src="../assets/sound.png" alt="">
                <div class="users">
                    <img v-if="userJoined" src="../assets/account_profile_user_icon.png" :alt="username">
                </div>
                <img src="../assets/voice.png" style="height: 60px;" alt=""> 
            </div>
            <div class="roomCode">
                <h5>КОД:</h5>
                <h5 class="code">{{ $route.params.roomCode }}</h5>
            </div>
            <p class="exit">Выйти</p>
        </div>
        <div class="chatSpace">
            <div class="messages">
                <div class="messageSpace">
                    <div class="message">
                        <h6>Bruno</h6>
                        <p>Го вало</p>
                    </div>
                </div>
                <div class="myMessageSpace">
                    <div class="myMessage">
                        <h6>Chelovek</h6>
                        <p>Кеттк</p>
                    </div>
                </div>
            </div>
            <div class="input">
                <input type="text" placeholder="Введите сообщение">
                <button>Отправить</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.header{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    color: #800000;
    margin-top: 20px;
}
.elements{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: auto;
    width: 100%;
    border-radius: 20px;
}
.elements img{
    height: 50px;
    width: 50px;
    margin: 0px 10px;
    cursor: pointer;
}
.users{
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100px;
    width: auto;
    border: 1px solid #ffffff;
    border-radius: 20px;
    padding: 0px 10px;
}
.users img{
    background-color: white;
    border-radius: 50%;
    height: 50px;
    width: 50px;
    margin: 0px 10px;
}
.roomCode{
    width: 60%;
    color: #ffffff;
    border: solid 1px #ffffff;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    margin: 10px 0px;
    padding: 10px 20px;
}
.code{
    margin-right: 40%; 
    font-style: italic;
}
.exit{
    color: #af0101;
    cursor: pointer;
}
.exit:hover{
    color: #ff0000;
    text-decoration: underline;
}
.chatSpace{
    height: 60vh;
    width: 100%;
    background-color: #ffffff;
    border-radius: 20px;
    padding: 10px 5px;
}
.messages{
    height: 86%;
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;        /* Firefox */
    -ms-overflow-style: none;     /* IE/Edge */
}
.messages::-webkit-scrollbar {
    display: none;                /* Chrome/Safari */
}
.messageSpace{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 1%;
}
.message{
    background-color: #6E6E6E;
    width: 35%;
    border-radius: 20px;
    padding: 1% 2%;
    color: #ffffff;
}
.message p{
    font-size: small;
}
.myMessage p{
    font-size: small;
}
.myMessageSpace{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 1%;
}
.myMessage{
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    background-color: #6E6E6E;
    width: 35%;
    border-radius: 20px;
    padding: 1% 2%;
    color: #ffffff;
}
.input{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: auto;
    width: 100%;
    padding: 1%;
}
.input input{
    width: 70%;
    height: 50px;
    border-radius: 20px;
    padding: 20px;
    outline: none;
    border: none;
    box-shadow: black 0px 0px 5px;
    margin: 5px 0px;
    margin-right: 1%;
}
input:focus{
    box-shadow: black 0px 0px 13px;
    transition: all 0.2s ease-in-out;
}
/* .input input:hover{
    box-shadow: black 0px 0px 13px;
    transition: all 0.2s ease-in-out;
} */
.input button{
    width: 20%;
    height: 50px;
    border-radius: 20px;
    border: none;
    box-shadow: black 0px 0px 5px;
    font-weight: bold;
    color: #207a25;
    font-size: small;
}
.input button:hover{
    box-shadow: #207a25 0px 0px 10px;
    transition: all 0.2s ease-in-out;
}
@media screen and (max-width: 768px) {
    .input button, .input input{
        height: 40px;
        font-size: 10px;
    }
    
}
</style>