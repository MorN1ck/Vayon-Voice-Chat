<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onBeforeRouteLeave } from 'vue-router'
import { socket } from '../socket';
import Peer from 'simple-peer';

import micImg from '../assets/micro.svg';
import micMuteImg from '../assets/micro-mute.svg';
import soundOnImg from '../assets/sound-on.svg';
import soundMuteImg from '../assets/sound-mute.svg';


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
const isMuted = ref(false)
const peer = ref('');
const messagesContainer = ref(null)

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
    //simple peer
    peer.value = new Peer({
        initiator: true,
        trickle: false,
        stream: localStream.value
    })
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
    isMuted.value = !isMuted.value
    audio.value.muted = isMuted.value
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
    nextTick(() => {
        const el = messagesContainer.value
        if (el && el.scrollHeight > el.clientHeight) {
            el.scrollTop = el.scrollHeight
        }
    })
});

</script>
<template>
    <div class="header">
        <div class="elements">
            <img @click="toggleSound" :src="isMuted ? soundMuteImg : soundOnImg" alt="">
            <div class="users">
                <img v-for="user in users" :key="user.id" src="../assets/account_profile_user_icon.png" :alt="user.name">
            </div>
            <img id="mic" @click="toggleMic" :src="micOn ? micImg : micMuteImg" alt=""> 
        </div>
        <div class="roomCode">
            <h5>КОД:</h5>
            <h5 class="code">{{ $route.params.roomCode }}</h5>
        </div>
        <p class="exit" @click="Disconnect">Выйти</p>
    </div>
    <div class="chatSpace">
        <div class="messages" ref="messagesContainer">
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
    
</template>
<style scoped>
.header{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0px;
    width: 100%;
    color: #800000;
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
    height: clamp(30px, 3.33vw, 50px);
    width: clamp(30px, 3.33vw, 50px);
    margin: 0px 10px;
    cursor: pointer;
}
#mic{
    height: clamp(25px, 3vw, 45px); 
    width: clamp(25px, 3vw, 45px);
}
.users{
    display: flex;
    flex-direction: row;
    align-items: center;
    height: auto;
    width: auto;
    border: 1px solid #ffffff;
    border-radius: 20px;
    padding: 20px 10px;
}
.users img{
    background-color: white;
    border-radius: 50%;
    height: clamp(30px, 3.33vw, 50px);
    width: clamp(30px, 3.33vw, 50px);
    margin: 0px 10px;
}
.roomCode{
    position: relative;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: row;
    width: 60%;
    color: #ffffff;
    border: solid 1px #ffffff;
    border-radius: 20px;
    margin: 10px 0px;
    padding: clamp(5px, 0.5vw, 10px) clamp(10px, 0.6vw, 20px);
}
.roomCode h5{
    font-size: clamp(0.8rem, 2vw, 1rem);
    user-select: text;
}

.code{
    position: absolute;
    right: 45%;
    font-style: italic;
}
.exit{
    color: #af0101;
    cursor: pointer;
    font-size: clamp(0.8rem, 1vw, 1rem);
}
.exit:hover{
    color: #ff0000;
    text-decoration: underline;
}
.chatSpace{
    height: auto;
    width: 100%;
    background-color: #ffffff;
    border-radius: 20px;
    padding: 10px 5px;
}
.messages{
    height: 50vh;
    width: 100%;
    overflow-y: auto;
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
    font-size: min(13px, 2.5vh);
    user-select: text;
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
.myMessage p{
    font-size: min(13px, 2.5vh);
    user-select: text;
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
    height: min(50px, 5vh);
    border-radius: 20px;
    padding: 20px;
    outline: none;
    border: none;
    box-shadow: black 0px 0px 5px;
    margin: 5px 0px;
    margin-right: 1%;
    font-size: min(13px, 2.5vh);
}
input:focus{
    box-shadow: black 0px 0px 13px;
    transition: all 0.2s ease-in-out;
}

.input button{
    width: 20%;
    height: min(50px, 6.25vh);
    border-radius: 20px;
    border: none;
    box-shadow: black 0px 0px 5px;
    font-weight: bold;
    color: #207a25;
    font-size: clamp(6px, 2.5vh, 10px);
}
.input button:hover{
    box-shadow: #207a25 0px 0px 10px;
    transition: all 0.2s ease-in-out;
}
@media (min-height: 2000px) {
    .roomCode h5, .exit{
        font-size: 30px;
    }
}
@media (min-height: 1400px) {
    .elements img{
        height: 100px;
        width: 100px;
    }
    #mic{
        height: 95px;
        width: 95px;
    }
    .users{
        padding: 20px 20px;
    }
    .roomCode h5, .exit{
        font-size: 30px;
    }
}
@media (min-height: 1300px) {
    .input input, .input button, .myMessage p{
        font-size: 20px;
    }
    
}
@media (max-width: 768px) {
    .messages{
        height: 50vh;
    }
}
</style>