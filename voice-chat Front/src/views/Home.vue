<script setup>
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
            <input type="text" placeholder="Введите ваше имя">
            <input type="text" placeholder="Код комнаты">
            <div class="buttons">
                <button>Создать</button>
                <button>Войти</button>
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
