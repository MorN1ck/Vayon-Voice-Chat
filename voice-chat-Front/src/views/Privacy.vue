<script setup>
import { useRouter } from 'vue-router';
const Router = useRouter();
</script>
<template>
    <div class="col-md-4 d-flex flex-column align-items-center mt-5 text-white">
        <h1 class="vayon" @click="Router.push('/')">VAYON</h1>
        <h1 class="text-white mt-5">Политика конфиденциальности</h1>
        <div class="box">
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
}
.box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 80vh;
}
#mail{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

</style>