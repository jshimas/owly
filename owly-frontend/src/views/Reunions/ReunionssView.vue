<template>
    <div class="w-100 vh-100 backgroundPages overflow-auto">
        <h1 class="m-5">Reuniões</h1>
        <template
        v-for="Reunion in ReunionStore.GetReunions"
         :key="Reunion.id">
        <div class="bg-white p-2  mx-5 mb-3 d-flex rounded"  style="width:fit-content" v-if="Reunion.collaborators.some(ColID => ColID == userStore.LoggedUserGetter.id)">
            <b-img class="mr-2" :src="Reunion.picture"  width="40"></b-img>
             <span class="mr-2">
                {{ Reunion.name }} 
            </span>
            <b-button :to="'/Reunion/'+Reunion.id">Ver</b-button>
        </div>
        </template> 
        <b-button class="mx-5" v-if="CreateReunionBtn" to="/Reunions/CreateReunion">Criar Reunião</b-button>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useReunionStore } from '../../stores/Reunion.js'
import { useUserStore } from "../../stores/User.js";

export default {
    setup () {
        const ReunionStore = useReunionStore()
        const userStore = useUserStore()

        let CreateReunionBtn = true
        
        if(userStore.LoggedUserGetter.role != 'Coordenador' && userStore.LoggedUserGetter.admin != true){
            CreateReunionBtn = false
        }

        return {ReunionStore,userStore,CreateReunionBtn}
    }
}
</script>

<style lang="scss" scoped>

</style>