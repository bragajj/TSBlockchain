<template>
  <div>
    <div class="row">
      <b-container>
        <b-card class="col-12" bg-variant="dark" text-variant="white">
          <b-card-text>
            Welcome to our Blockchain proof of concept

          </b-card-text>
            <b-card-text>
                <b-row class="my-1">
                    <b-col sm="2" class="offset-sm-2">
                        <label for="server-address">Server Address:</label>
                    </b-col>
                    <b-col sm="6">
                        <b-form-input
                          id="server-address"
                          v-model="defaultServerAddress"
                ></b-form-input>
                    </b-col>
                </b-row>
                <b-row class="my-1">
                    <!-- 
                  <b-col sm="2" class="offset-sm-2">
                      <label for="pub-id">Pub API:</label>
                  </b-col>
                  <b-col sm="6">
                      <b-input-group prepend="ID:">
                          <b-form-input
                            id="pub-id"
                            type="number"
                            v-model="searchPubId"
                  ></b-form-input>
                          <b-button variant="info" @click="searchById()"
                    >Search</b-button
                  > </b-input-group>
                  </b-col>
                  <b-col>
                  
                  <b-button variant="primary" class="ml-2" @click="getAll()"
                    >Get All</b-button
                  >
                  </b-col>
                 -->
                    <b-col sm="2" class="offset-sm-2 text-left">
                        <label>Desired Prefix (0,00,000,etc):</label>
                    </b-col>
                    <b-col sm="2">
                        <b-form-input size="sm" v-model="diff_level"></b-form-input>
                    </b-col>

                </b-row>
                <b-row>
                <b-col sm="2" class="offset-sm-2 text-left">
                    <label>Max # of attempts:</label>
                </b-col>
                <b-col sm="2">
                    <b-form-input size="sm" v-model="attempts"></b-form-input>
                </b-col>
                </b-row>
                <b-row>
                    <b-col sm="2" class="offset-sm-2">
                    </b-col>
                    <b-col sm="6">
                        <b-button variant="success" class="ml-2" @click="createNew()"
                    >Add Block</b-button
                  >
                        <b-button variant="success" class="ml-2" @click="clear()"
                    >Clear</b-button
                  >
                    </b-col>

                </b-row>

                <b-row>
                    <b-col sm="8" class="offset-sm-2">
                        <b-alert fade="" :show="showErrorBanner" dismissible="" variant="danger" @dismissed="showErrorBanner=false">
                            {{ errorMessage }}
                        </b-alert>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="8" class="offset-sm-2">
                        <b-alert fade="" v-bind:show="showOkBanner" dismissible="" variant="success" @dismissed="showOKBanner=false">
                            {{ okMessage }}
                        </b-alert>
                    </b-col>
                </b-row>
            </b-card-text   >
        </b-card>
      </b-container>
    </div>
    <hr />
      <div class ="row" >
          <div  
            class="col-sm-6 mb-2"    
             v-for="(course, index) in courseList"
            :key="index"
      >
              
              <pub-child    
                :card-data="course"
                @update-class-info="onUpdateClass"
				@hash-message="onHashMessage"
        ></pub-child>
          </div>

          <b-row>
          <div class="row" v-if ="enterNew">
              <!-- trying to add new -->
              <pub-child
              :card-data= "(course, 0) in courseList"
              
                  ></pub-child>
          </div>
          </b-row>
      </div>
  </div>
</template>
  

<script lang="ts">
	/* eslint-disable */
	import { Component, Prop, Emit, Watch, Vue } from "vue-property-decorator";
	import Pub from "./Pub.vue";
	import { AxiosResponse, AxiosError } from "axios";
	import * as blockType from "./BlockType";
	import * as cryptoJ from 'crypto-js';



	@Component({ components: { "pub-child": Pub } })
	export default class ServiceParent extends Vue {
	private courseList: BlockType[] = [];
	private defaultServerAddress = "http://localhost:3000";
	private searchPubId = "1";
	private showErrorBanner = false;
	private errorMessage = "valid hash not found";
	private showOkBanner = false;
	private okMessage = "";
	private enterNew = false;
	private counter = 0;
	private diff_level = 0;
	private attempts = 100;
	private startTime = 0;
	private endTime = 0;


	searchById() {
	console.log("searchbyid");
	this.showErrorBanner =  false;
	this.showOkBanner =  false;
	this.courseList = [];
	const endpoint = this.defaultServerAddress + "/blocks/" + this.searchPubId;
	this.$http
	.get<BlockType>
		(endpoint)
		.then((response) => {
		this.okMessage = "Fetched Course with ID: " + this.searchPubId;
		this.showOkBanner = true;
		const result = response.data;
		this.courseList = [result];
		console.log(result);
		})
		.catch((err: AxiosError) => {
		console.log("ERROR ", err.response);
		this.errorMessage = "HTTP Error:"
		+ err.response!.status
		+ "; Msg: "+ err.response!.statusText;
		this.showErrorBanner = true;
		this.showOkBanner =  false;
		});
		}



		updateParent(c: BlockType, l: Array){
		if (c.id > 1) {
		let num = c.id-2;
		c.priorHash = this.courseList[num].hash;}}

		updates(l: Array){
		for (var b of l){
		this.updateParent(b,l);
		}}


		onHashMessage(c: BlockType){
		const cText = JSON.stringify("Try block " + c.id + " again.")
		this.$bvToast.toast(cText, {
		title: 'Hash Not Found',
		autoHideDelay: 5000,
		appendToast: true
		})
		}




		onUpdateClass(c: BlockType) {
		this.showErrorBanner = false;
		this.showOkBanner =  false;
		c.difficultyLevel = this.diff_level;

		this.startTime = Math.round(new Date().getTime());
		while (this.attempts > c.nonce && !c.hash.startsWith(this.diff_level)) {
		this.showErrorBanner = false;
		c.nonce++;
		c.hash = cryptoJ.SHA256(c.id + c.priorHash + c.timestamp + c.data + c.difficultyLevel + c.nonce).toString();
		console.log(c.nonce + " " + c.hash);

		this.endTime = Math.round(new Date().getTime());
		c.timestamp = this.endTime - this.startTime;
		}

		if (!c.hash.startsWith(this.diff_level)) {
		this.showErrorBanner = !false;
		c.hashFail = true;
		c.hashSuccess = false;
		this.onHashMessage(c);
		c.nonce = 0;

		
		while (this.attempts > c.nonce && !c.hash.startsWith(this.diff_level)) {
		this.showErrorBanner = false;
		c.nonce++;
		c.hash = cryptoJ.SHA256(c.id + c.priorHash + c.timestamp + c.data + c.difficultyLevel + c.nonce).toString();
		console.log(c.nonce + " " + c.hash);

		this.endTime = Math.round(new Date().getTime());
		c.timestamp = this.endTime - this.startTime;
		}}
		else 
		{
		c.hashSuccess = true;
		c.hashFail = false;
		}

		this.updates(this.courseList);

		const endpoint = this.defaultServerAddress + "/blocks/" + c.id ;
		this.$http.put<BlockType>
            (endpoint,c
            );	
			
        return c.hash;
        }



            createNew() {
            this.counter += 1;
            this.showOkBanner =  false;


            this.courseList.push({
            "id": this.counter,
            "hash": "",
            "priorHash": "af21a5a7e781414961f3befe19d5f6866633d06ea5a55057e5297544a9eb1a50",
            "timestamp": 0,
            "data": "",
            "difficultyLevel": 0,
            "nonce": 0});


            this.$http.request({
            url: this.defaultServerAddress + "/blocks/" ,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
            "id": "",
            "hash": "",
            "priorHash": "",
            "timestamp": 1,
            "data": "",
            "difficultyLevel": 0,
            "nonce": 0 })
            });

            }
            
            
            
clear(){
            this.courseList = [];

            }

        

    
        
        
        
        
        
        
        
        
        
        
        
        }




            





        </script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>