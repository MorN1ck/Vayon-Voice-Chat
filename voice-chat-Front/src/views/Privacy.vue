<script setup>
import { useRouter } from 'vue-router';
const Router = useRouter();
</script>
<template>
    <div class="d-flex flex-column align-items-center text-white">
        <h1 class="vayon" @click="Router.push('/')">VAYON</h1>
        <div class="box">
            <div class="privacyBox">
                <h1>Политика конфиденциальности</h1>
            </div>
            <h5>Сервис Vayon не собирает и не хранит персональные данные пользователей.
            Все соединения происходят напрямую между участниками (peer-to-peer), без сохранения информации на сервере.</h5>
            <ul>
                <li>Мы не сохраняем имя, IP-адрес или аудиозаписи.</li>
                <li>Вся передача данных происходит анонимно и зашифрована через WebRTC.</li>
                <li>Данные передаются только в рамках активного голосового соединения и удаляются автоматически после завершения сессии.</li>
                <li>Cookies, трекеры или сторонние аналитические сервисы не используются.</li>
                <li>Vayon это 
                    <a href="http://github.com/" target="_blank" rel="noopener noreferrer" class="text-white text-decoration-white">open source</a>
                    проект.</li>
                <li>Если вы обнаружите утечку персональных данных, свяжитесь с нами.</li>
            </ul>
            <div id="mail">
                <h5 >Почта:</h5>
                <p>voice.vayon@gmail.com</p>
            </div>      
        </div>
    </div>
</template>
<style scoped>
.vayon{
    font-family: "Bayon", sans-serif;
    font-weight: 400;
    font-style: normal;
    color: white;
    font-size: 64px;
    cursor: pointer;
    margin-top: 15px;
}
.privacyBox{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: clamp(0.5rem, 4vw, 0.8rem);
}
.box h1 {
    text-align: center;
    color: white;
    font-size: clamp(1rem, 1.2vw, 1.8rem);
}
.box h5{
    text-align: center;
    font-size: clamp(0.8rem, 1.2vw, 1.2rem);
}
.box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.05);
    padding: clamp(1rem, 4vw, 2rem);
    border-radius: 20px;
    font-size: clamp(0.7rem, 1.2vw, 1.1rem);
    line-height: 1.6;
    color: #ffffff;
}
#mail{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

</style>