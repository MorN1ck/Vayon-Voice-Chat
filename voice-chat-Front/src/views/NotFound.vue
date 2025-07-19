<script setup>
import { on } from 'events';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const Router = useRouter();
const anim = ref(false);
onMounted(() => {
    setTimeout(() => {
        anim.value = true;
    }, 500);
})
</script>

<template>
    
    <div class="col-md-4">
        <transition name="fade">
            <div v-if="anim" class="d-flex flex-column align-items-center justify-content-center" style="height: 100vh; width: 100%;">
                <h1 class="text-white">404</h1>
                <h1 class="text-white">Page not found</h1>
                <button class="btn" @click="Router.push('/')">На главную</button> 
            </div>
        </transition>
    </div>
    
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    animation: fade 0.5s ease-in-out;
}
@keyframes fade {
    from {
        opacity: 0; 
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.btn{
    background-color: white;
    color: black;
    margin-top: 10px;
    font-family: 'Roboto', sans-serif;
}
.btn:hover{
    box-shadow: #ffffff 0px 0px 5px;
    border: none;
    background-color: black;
    color: #ffffff;
    transition: all 0.2s ease-in-out;
}
</style>