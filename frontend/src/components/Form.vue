<script>
import Swal from 'sweetalert2'
import { saveAs } from 'file-saver';

export default {
    data() {
        return {
            user: '',
            pass: '',
            auth: false,
            token: ''
        }
    },
    methods: {
        sendForm: async function() {
            if(!this.auth) {
                if(this.user == '' || this.pass == '') {return 0}

                const url = 'http://localhost:3000';
                const uriLog = '/login';

                const res = await fetch(url+uriLog, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        "username": this.user,
                        "password": this.pass
                    })
                })

                if(res.status == 200) {
                    this.auth = true;
                    Swal.fire({
                        icon: 'success',
                        title: 'You are all set!',
                        text: 'Login successful'
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Incorrect username or password'
                    })
                }
            } else {
                Swal.fire({
                        icon: 'info',
                        title: 'You are already set!',
                        text: 'Already authenticated'
                    })
            }
        },
        downloadJson: async function() {
            if(this.auth) {
                const url = 'http://localhost:3000';
                const uriDow = '/download';

                await fetch(url + uriDow)
                    .then((val) => {
                        return val.json()
                    })
                    .then((json) => {
                        let fileName = 'data.json';

                        let fileToSave = new Blob([JSON.stringify(json, null, 4)], {
                            type: 'application/json',
                            name: fileName
                        });

                        saveAs(fileToSave, fileName);
                    })
                
            }
        }
    }
}
</script>

<template>
    <div class="downloadButton">
        <button id="downloadButton" type="download" v-if="auth" @click="downloadJson()"><img src="../assets/download.svg"></button>
    </div>
    <div class="usernameText">
        <input id="userInput" class="e-input" type="text" name="username" placeholder="Username" @change="(val) => this.user = val.target.value"/>
    </div>
    <div class="passwordText">
        <input id="passwInput" class="e-input" type="text" name="password" placeholder="Password" @change="(val) => this.pass = val.target.value"/>
    </div>
    <div class="submitButton">
        <button id="submitButton" type="submit" @click="sendForm()">Login</button>
    </div>
</template>

<style>

    .usernameText, .passwordText {
        display: flex;
        place-items: center;
        justify-content: right;
    }

    .submitButton {
        display: flex;
        place-items: center;
        justify-content: center;
    }

    .downloadButton {
        display: flex;
        place-items: center;
        justify-content: right;
    }

    input[type=text] {
        width: 80%;
        padding: 4px 7px;
        display: inline-block;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 15px;
    }

    button[type=submit] {
        width: 50%;
        background-color: rgb(0, 170, 113);
        color: white;
        padding: 4px 7px;
        text-align: center;
        border: none;
        border-radius: 4px;
        font-size: 15px;
        cursor: pointer;
    }

    button[type=submit]:hover {
        background-color: rgb(0, 136, 91);
    }

    button[type=submit]:active {
        background-color: rgb(0, 100, 67);
    }

    button[type=download] {
        width: 32%;
        background-color: rgb(0, 147, 184);
        color: white;
        padding: 2px;
        text-align: center;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button[type=download]:hover {
        background-color: rgb(0, 126, 158);
    }

    button[type=download]:active {
        background-color: rgb(0, 105, 131);
    }

    img {
        max-height: 100%;
        max-width: 100%;
    }
</style>