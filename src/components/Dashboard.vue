<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Dashboard </div>
            <div class="card-body" v-if="user.loggedIn">
                <div class="alert alert-success" role="alert">You are logged in!</div>
                <div class="row">
                    <div class="col-12">
                    <h2>
                        Room List
                        <b-button v-b-modal.modal-1>Create Room</b-button>

                        <b-modal id="modal-1" title="Create Room">
                            <b-form @submit="onSubmit">
                                <b-form-group>
                                    <b-form-input id="roomname" v-model.trim="room.roomName" placeholder="Enter Room Name"></b-form-input>
                                </b-form-group>
                                <b-button type="submit" variant="primary" :disabled="!room.roomName">Save</b-button>
                            </b-form>
                        </b-modal>
                    </h2>
                    <hr/>
                    <b-list-group>
                        <b-list-group-item v-for="room in filteredRooms" :key="room.uuid" :to="{name: 'Chat', params: {nickname: user.data.displayName, roomid: room.key, roomname: room.roomName}}" action>
                            {{room.roomName}}
                        </b-list-group-item>
                    </b-list-group>
                    </div>
                </div>
            </div>
            <div class="card-body" v-else>
                <b-button v-b-modal.modal-1>Login</b-button> &nbsp;&nbsp;&nbsp;&nbsp;
            <b-button v-b-modal.modal-2 class="pull-right">Register</b-button>
              <b-modal id="modal-1" title="Login">
                  <div v-if="error" class="alert alert-danger">{{error}}</div>
                  <b-form @submit.prevent="login">
                        <b-form-group label="Email" label-for="input-1">
                            <b-form-input id="input-1" v-model.trim="form.email" placeholder="Email"></b-form-input>
                        </b-form-group>
                        <b-form-group label="Password" label-for="input-2">
                            <b-form-input id="input-2" v-model.trim="form.password" type="password"></b-form-input>
                        </b-form-group>
                      <b-button type="submit" variant="primary" :disabled="!form.password">Login</b-button>
                  </b-form>
              </b-modal>
              <b-modal id="modal-2" title="Register">
                  <div v-if="error" class="alert alert-danger">{{error}}</div>
                  <div v-if="success" class="alert alert-success">{{success}}</div>
                  <b-form @submit.prevent="register">
                      <b-form-group label="Name" label-for="input-3">
                          <b-form-input id="input-3" v-model.trim="formReg.name" placeholder="Name"></b-form-input>
                      </b-form-group>
                      <b-form-group label="Password" label-for="input-4">
                          <b-form-input id="input-4" v-model.trim="formReg.email" placeholder="Email"></b-form-input>
                      </b-form-group>
                      <b-form-group label="Password" label-for="input-5">
                          <b-form-input id="input-5" v-model.trim="formReg.password" type="password"></b-form-input>
                      </b-form-group>
                      <b-button type="submit" variant="primary" :disabled="!formReg.password">Register</b-button>
                  </b-form>
              </b-modal>
            </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
import { writeData, getData, login, register } from '../utilities';
import { mapGetters } from "vuex";
export default {
    data () {
        return {
            rooms: [],
            errors: [],
            error: "",
            success: "",
            room: { roomName: "" },
            form: {
                email: "",
                password: ""
            },
            formReg: {
                name: "",
                email: "",
                password: ""
            },
        }
    },
    created () {
        this.rooms = getData('chatrooms/');
    },
    methods: {
        onSubmit (evt) {
            evt.preventDefault()
            writeData('chatrooms/',{
                uuid: Math.random().toString().replace('0.', ''),
                owner: this.user.data.displayName,
                roomName: this.room.roomName
            })
        },
        login() {
            try {
                if(login(this.form)) this.$router.push({ name: "Dashboard" });
            } catch (error) {
                this.error = error.message;
            }
        },
        register() {
            try {
                if(register(this.formReg)) this.success = "user created successfully";
            } catch (error) {
                this.error = error.message;
            }
        }
    },
    computed: {
        // map `this.user` to `this.$store.getters.user`
        ...mapGetters({
            user: "user"
        }),
        filteredRooms: function() {
            let filtered = this.rooms;
            filtered.filter((item, index) => {
                return filtered.indexOf(item) == index;
            })
            return filtered;
        }
    }
};
</script>