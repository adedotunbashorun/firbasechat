<template>
<div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h2>
                  {{roomname}}
                  <b-link @click="exitChat()">(Exit Chat)</b-link>
                </h2> 
              </div>
            <b-row>
              <b-col cols="8">
                <b-form-group>
                    <b-form-input v-model.trim="search" placeholder="search...."></b-form-input>
                </b-form-group>
                <div class="chat-box" v-chat-scroll>
                  <b-list-group>
                    <b-list-group-item class="chat-item" v-for="chat in filteredChat" :key="chat.uuid">
                      <div class="chat-status text-center" v-if="chat.type==='join'|| chat.type==='exit'">
                        <span class="chat-date">{{chat.sendDate}}</span>
                        <span class="chat-content-center">{{chat.message}}</span>
                      </div>
                      <div v-else>
                        <div class="chat-message text-right" v-if="chat.user === nickname">
                          <div class="right-bubble">
                            <span class="msg-name">Me</span>
                            <span class="msg-date">{{chat.sendDate}}</span>
                            <p text-wrap>{{chat.message}}</p>
                          </div>
                        </div>
                        <div class="chat-message text-left" text-left v-if="chat.user !== nickname">
                          <div class="left-bubble">
                            <span class="msg-name">{{chat.user}}</span>
                            <span class="msg-date">{{chat.sendDate}}</span>
                            <p text-wrap>{{chat.message}}</p>
                          </div>
                        </div>
                      </div>
                    </b-list-group-item>
                  </b-list-group>
                  <!-- <footer class="sticky-footer"> -->
                    <b-form @submit="onSubmit">
                      <b-input-group>
                          <b-form-input id="message" v-model.trim="data.message" placeholder="Enter your message"></b-form-input>
                          <b-button type="submit" variant="primary" :disabled="!data.message">Send</b-button>
                      </b-input-group>
                    </b-form>
                  <!-- </footer> -->
                </div>
              </b-col>
              
            </b-row>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { writeData,getData } from '../utilities';
import router from '../router';
import { mapGetters } from "vuex";

export default {
  name: 'Chat',
  data () {
    return {
        roomid: this.$route.params.roomid,
        roomname: this.$route.params.roomname,
        nickname: this.$route.params.nickname,
        data: { type:'', nickname:'', message:'' },
        search: '',
        chats: [],
        members: [],
        errors: [],
        offStatus: false
    }
  },
  computed: {
    ...mapGetters({
      user: "user"
    }),
    filteredChat: function() {
      let filtered = this.chats;
      if (this.search) {
        filtered = this.chats.filter(
          chat => chat.message.toLowerCase().indexOf(this.search) > -1
        );
      }
      filtered.filter((item, index) => {
        return filtered.indexOf(item) == index;
      })
      return filtered;
    }
    // map `this.user` to `this.$store.getters.user
  },
  mounted() {
    if(!this.user.loggedIn){
      router.push({ name: 'Dashboard'})
    }
  },
  created () {
    const members = this.members = getData(`chatrooms/${this.roomid}/member`);
    if(members.some(member => member.user === this.nickname)){
        console.log(true);
    } else{
      try {
        writeData(`chatrooms/${this.roomid}/member`,{
            uuid: Math.random().toString().replace('0.', ''),
            type: 'member',
            user: this.nickname,
            sendDate: Date()
        });
        writeData(`chatrooms/${this.roomid}/chats`,{
          uuid: Math.random().toString().replace('0.', ''),
          type: 'join',
          user: this.nickname,
          message: this.nickname+' has joined this room.',
          sendDate: Date()
        });
      } catch (error) {
        console.log(error.message)
      }
    }
    this.chats = getData(`chatrooms/${this.roomid}/chats`);
    this.data.message = '';
  },
  methods: {
    onSubmit (evt) {
        evt.preventDefault()
        try {
          writeData(`chatrooms/${this.roomid}/chats`,{
            uuid: Math.random().toString().replace('0.', ''),
            type: 'newmsg',
            user: this.nickname,
            message: this.data.message,
            sendDate: Date()
          });
          this.data.message = '';
        } catch (error) {
          console.log(error.message)
        }
        
    },
    exitChat () {
      try{
        writeData(`chatrooms/${this.roomid}/chats`,{
          uuid: Math.random().toString().replace('0.', ''),
          type: 'exit',
          user: this.nickname,
          message: this.nickname+' has exited this room.',
          sendDate: Date()
        });
        // firebase.database().ref('chatrooms/'+this.roomid+'/chats/members/'+this.nickname).remove()

        this.offStatus = true
        router.push({ name: 'Dashboard'})
      } catch (error) {
          console.log(error.message)
      }
    }
  }
}
</script>

<style>
  .chat-box {
    height: 500px;
    width: 100%;
    overflow: scroll;
  }
  .chat-item {
    border: none;
  }
  .chat-status {
    min-height: 49px;
  }
  .chat-status .chat-date {
    display: block;
    font-size: 10px;
    font-style: italic;
    color: #999;
    height: 15px;
    left: 10%;
    right:10%;
  }
  .chat-status .chat-content-center {
    padding: 5px 10px;
    background-color: #e1e1f7;
    border-radius: 6px;
    font-size: 12px;
    color: #555;
    height: 34px;
    left: 10%;
    right:10%;
  }
  .chat-message {
    width: 80%;
    min-height: 40px;
  }
  .chat-message .right-bubble {
    position: relative;
    background: #e7f0e0;
    border-top-left-radius: .4em;
    border-bottom-left-radius: .4em;
    border-bottom-right-radius: .4em;
    padding: 5px 10px 10px;
    left: 15%;
  }
  .chat-message .right-bubble span.msg-name {
    font-size: 12px;
    font-weight: bold;
    color: green;
    display: block;
  }
  .chat-message .right-bubble span.msg-date {
    font-size: 10px;
    display: block;
  }
  .chat-message .right-bubble:after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 0;
    height: 0;
    border: 27px solid transparent;
    border-left-color: #dcf8c6;
    border-right: 0;
    border-top: 0;
    margin-top: -0.5px;
    margin-right: -27px;
  }
  .chat-message .left-bubble {
    position: relative;
    background: #efefef;
    border-top-right-radius: .4em;
    border-bottom-left-radius: .4em;
    border-bottom-right-radius: .4em;
    padding: 5px 10px 10px;
    left: 5%;
  }
  .chat-message .left-bubble span.msg-name {
    font-size: 12px;
    font-weight: bold;
    color: blue;
    display: block;
  }
  .chat-message .left-bubble span.msg-date {
    font-size: 10px;
    display: block;
  }
  .chat-message .left-bubble:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    border: 27px solid transparent;
    border-right-color: #efefef;
    border-left: 0;
    border-top: 0;
    margin-top: -0.5px;
    margin-left: -27px;
  }
  footer.sticky-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    background-color: #ffffff;
    border-top: solid 1px #efefef;
  }
</style>