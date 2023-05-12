<template>
    <div class="w-100 vh-100 backgroundPages overflow-auto">
        <div class="h-75 overflow-auto" ref="Chat">
            <div class="m-5">
                <h1>
                    
                    
                    
                    <span v-if="!EditName">{{ ReunionStore.GetReunionById(Route.params.id).name }}</span>
                    <template v-if="!ReunionStore.GetReunionById(Route.params.id).archived">
                        <template v-if="UserStore.LoggedUserGetter.id == ReunionStore.GetReunionById(Route.params.id).leader">
                            <b-input v-model="ReunionStore.GetReunionById(Route.params.id).name" v-if="EditName"></b-input>
                            <b-button variant="primary" @click="EditName =  !EditName " v-if="!EditName ">Editar Nome</b-button>
                            <b-button variant="primary" @click="EditName =  !EditName " v-else>Fechar</b-button>
                        
                        </template>
                        
                    </template>
                </h1>
                <small v-if="ReunionStore.GetReunionById(Route.params.id).archived">Reunião Arquivada 
                </small>
    
                <template v-if="UserStore.LoggedUserGetter.id == ReunionStore.GetReunionById(Route.params.id).leader">
                <b-button 
                size="sm"
                @click="ReunionStore.GetReunionById(Route.params.id).archived = !ReunionStore.GetReunionById(Route.params.id).archived" 
                v-if="ReunionStore.GetReunionById(Route.params.id).archived" >Desarquivar</b-button>
                <b-button
                size="sm"
                @click="ReunionStore.GetReunionById(Route.params.id).archived = !ReunionStore.GetReunionById(Route.params.id).archived"
                v-else>Arquivar</b-button>
                <b-img v-if="ReunionStore.GetReunionById(Route.params.id).picture" :src="ReunionStore.GetReunionById(Route.params.id).picture"></b-img>
                </template>
    
    
            </div>
            
    
            <template v-for="Message in MessageStore.GetMessagesByReunion(Route.params.id)" :key="Message.id">
                <!-- LoggedUser -->
                <div class="text-white card w-25 mx-5 mb-2 p-3" v-if="UserStore.LoggedUserGetter.id == Message.author">
                    <b-img v-if="Message.image" :src="Message.image" width="50px"></b-img>
                   
                   <p>
                       {{ Message.text }} 
                   </p> 
                    <small>{{ new Date(Message.date).toLocaleString('default', { 
                                                    day: '2-digit', 
                                                    month: '2-digit', 
                                                    year: 'numeric', 
                                                    hour: '2-digit', 
                                                      minute: '2-digit'
                                                    }).replace(',','') }} </small>
                    <div>
                    <b-button class="position-absolute" style="top:0; right:0" v-if="!ReunionStore.GetReunionById(Route.params.id).archived" variant="clear" @click="MessageStore.DeleteMessage(Message.id)"><img src="../../assets/imgs/Iconsax/Linear/remove.svg "></b-button>
                    </div>
                </div>
    
                 <!-- OtherUsers -->
                <div  class="text-green d-flex flex-row-reverse mx-5 mb-2"  v-if="UserStore.LoggedUserGetter.id != Message.author">
                    <div class="card w-25 align-self-end p-3" style="background:#FDF8C0">
    
                    
                    <b-img v-if="Message.image" :src="Message.image"></b-img>
                    {{ Message.text }} 
                    <small @click="Router.push('/Profile/'+Message.author)"> {{ UserStore.GetUserFunc(Message.author).name }} <br>
                     {{ new Date(Message.date).toLocaleString('default', { 
                                                    day: '2-digit', 
                                                    month: '2-digit', 
                                                    year: 'numeric', 
                                                    hour: '2-digit', 
                                                    minute: '2-digit'
                                                    }).replace(',','') }} </small>
                        </div>
                    </div>
                    
                    
                </template>

        </div>
            
                <b-form inline class="p-5 justify-content-center bg-opaquewhite h-25 " style="width: inherit" v-if="!ReunionStore.GetReunionById(Route.params.id).archived" @submit="CreateMessage"> 
                    <b-form-group class="mr-2">
                        <b-input placeholder="Enviar mensagem..." v-model="message"></b-input>
                    </b-form-group>
                    <b-form-group  class="mr-2 ">
                        <b-file 
                        v-model="messageFile"
                        id="ImagePicker"
                        placeholder="Escolha uma imagem (jpeg,png,gif)"
                        accept="image/jpeg, image/png, image/gif">
                    </b-file>
                </b-form-group>
                <b-button type="submit" :disabled="(!Boolean(message))"> Enviar Mensagem</b-button>
                </b-form>
            
        </div>
</template>

<script>
import { useReunionStore } from '../../stores/Reunion';
import { useMessageStore } from '../../stores/Message';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../../stores/User';

import { ref } from 'vue';

export default {
    setup () {

        

        const EditName = ref(false)

        const Router = useRouter()
        const Route = useRoute()
        const UserStore = useUserStore()
        const ReunionStore = useReunionStore()
        
        
        if(!ReunionStore.GetReunionById(Route.params.id).collaborators.some(el => el == UserStore.LoggedUserGetter.id)){
            Router.push('/home')
        }
        
        const MessageStore = useMessageStore()


        const message = ref('')
        const messageFile = ref('')
        console.log(MessageStore.GetMessagesByReunion(Route.params.id))

        function CreateMessage(){
            event.preventDefault()

            MessageStore.CreateMessage({
                 text : message.value ,
                  idReunion: Route.params.id ,
                   image: messageFile.value,
                    author: UserStore.LoggedUserGetter.id


            })

            message.value = ''
            messageFile.value = ''

        }

        const Chat =  ref(null)
        function ScrollToBottom(){
            Chat.value.scrollTop = Chat.value.scrollHeight

        }

        
        

        return {ReunionStore,MessageStore,Route,UserStore,message,messageFile,CreateMessage,EditName,Chat,ScrollToBottom,Router}
    },
    mounted(){
            this.ScrollToBottom()
    }
}
</script>

<style lang="scss" scoped>

</style>