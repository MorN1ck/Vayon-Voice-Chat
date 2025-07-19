<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onBeforeRouteLeave } from 'vue-router'
import { socket } from '../socket';
import Peer from 'simple-peer';

import micImg from '../assets/voice.png';
import soundImg from '../assets/sound.png';


const route = useRoute();
const router = useRouter();

const username = ref('');
const users = ref([]);
const otherUserId = ref('');
const messages = ref([]);
const message = ref('');
const localStream = ref('');
const audio = ref('');
const micOn = ref(true);
const peer = ref('');


async function getLocalStream() {
  localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
}

onMounted(() => {
    socket.on('userUpdate', (userData) => {
        users.value = userData;
        console.log(users.value);
    });
    socket.on('name', (myName, userId) => {
        username.value = myName;
        otherUserId.value = userId;
        
    })
    if (!localStorage.getItem('username') && !username.value) {
        router.push('/not-found');
    }
    
    window.addEventListener('beforeunload', leaveRoom);
})
onMounted(async () => {
    await getLocalStream();
    // локальное воис потом при публикаций удалить
    audio.value = document.createElement('audio');
    audio.value.srcObject = localStream.value;
    audio.value.autoplay = true;
    audio.value.muted = false; // ⚠️ будет слышно с задержкой и эхо
    document.body.appendChild(audio.value);
    //simple peer
    peer.value = new Peer({
        initiator: true,
        trickle: false,
        stream: localStream.value
    })
    // отправка сигнала другому учаснику
    peer.value.on('signal', signal => {
        socket.emit('signal', { to: otherUserId, signal });
    });
    peer.value.on('stream', remoteStream => {
        audio.value = document.createElement('audio');
        audio.value.srcObject = remoteStream;
        audio.value.autoplay = true;
        audio.value.muted = false;
        document.body.appendChild(audio.value);
    });
    //Получение сигнала от другого участника
    socket.on('signal', ({ from, signal }) => {
        peer.value.signal(signal);
    });
})

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', leaveRoom);
})
onBeforeRouteLeave((to, from, next) => {
    leaveRoom();
    next();
})
function toggleMic() {
  const audioTrack = localStream.value.getAudioTracks()[0];
  audioTrack.enabled = !audioTrack.enabled;
  micOn.value = audioTrack.enabled;
}
function toggleSound() {
  audio.value.muted = !audio.value.muted;
  console.log(audio.value.muted);
}
function leaveRoom() {
    peer.value.destroy();

    localStream.value?.getTracks().forEach(track => track.stop());  
    
    if (audio.value) {
        audio.value.pause();
        audio.value.srcObject = null;
        if (audio.value && document.body.contains(audio.value)) {
            document.body.removeChild(audio.value)
        }
    }   
    
    socket.emit('leaveRoom', { roomCode: route.params.roomCode });  
    localStorage.removeItem('username');
}
function Disconnect() {
    leaveRoom();
    router.push('/');
}
function sendMessage() {
    if (message.value == '') return;
    socket.emit('sendMessage', {
      roomCode: route.params.roomCode,
      text: message.value,
    });
    message.value = '';
}
socket.on('newMessage', (data) => {
    messages.value.push(data);
});

</script>
<template>
    <div class="col-md-4">
        <div class="header">
            <div class="elements">
               <img @click="toggleSound" :src="audio.muted ? micImg : soundImg" alt="">
                <div class="users">
                    <img v-for="user in users" :key="user.id" src="../assets/account_profile_user_icon.png" :alt="user.name">
                </div>
                <img @click="toggleMic" :src="micOn ? micImg : soundImg" style="height: 60px;" alt=""> 
            </div>
            <div class="roomCode">
                <h5>КОД:</h5>
                <h5 class="code">{{ $route.params.roomCode }}</h5>
            </div>
            <p class="exit" @click="Disconnect">Выйти</p>
        </div>
        <div class="chatSpace">
            <div class="messages">
                <div :class="msg.username === username ? 'myMessageSpace' : 'messageSpace'" v-for="(msg, index) in messages" :key="index">
                    <div :class="msg.username === username ? 'myMessage' : 'message'">
                        <h6>{{ msg.username }}</h6>
                        <p>{{ msg.text }}</p>
                    </div>
                </div>
            </div>
            <div class="input">
                <input type="text" placeholder="Введите сообщение" v-model="message" @keydown.enter="sendMessage">
                <button @click="sendMessage">Отправить</button>
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