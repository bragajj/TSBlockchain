<template> 
    <div class =" border " v-bind:class="{ 'border-success' : this.cardData.hashSuccess, 'border-danger' : this.cardData.hashFail }"  >
             <b-card title="Block"   >
            <b-card-text> Details </b-card-text>
            <b-card-text>
				<b-container >
                    <b-row class="my-1">
                        <b-col sm="3" class="offset-sm-2 text-left">
                            <label>Block Number:</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input
                              size="sm"
                              v-model="cardData.id"
                              readonly=""
              ></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="3" class="offset-sm-2 text-left">
                            <label>Parent:</label>
                        </b-col>
                        <b-col sm="6">
							<div> {{ cardData.priorHash }} </div>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="3" class="offset-sm-2 text-left">
                            <label>Data:</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input size="sm" v-model="cardData.data"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="3" class="offset-sm-2 text-left">
                            <label>Nonce:</label>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input size="sm" v-model="cardData.nonce" readonly=""></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="3" class="offset-sm-2 text-left">
                            <label>Hash:</label>
                        </b-col>
                        <b-col sm="6">
                            <div> {{ cardData.hash }}  </div>
                        </b-col>
                    </b-row>
					<b-row class="my-1">
						<b-col sm="3" class="offset-sm-2 text-left">
							<label>Time:</label>
						</b-col>
						<b-col sm="6">
							<div> {{ cardData.timestamp }} milliseconds </div>
						</b-col>
					</b-row>
					
                    <b-row class="my-2">
                        <b-col sm="2" class="offset-sm-2">
                            <b-button
                              :disabled="!cardDataChanged"
                             
                              size="sm"
                              @click="updateClass()"
                              :variant="!cardDataChanged ? 'success' : 'warning'"
                                
                >Mine</b-button
              >
                        </b-col>
                    </b-row>
                </b-container>
            </b-card-text>
        </b-card>
    </div>



</template>
  

<script lang="ts">
	import { Component, Prop, Emit, Watch, Vue } from "vue-property-decorator";
	import {BlockType, BlockChangeMessage} from './BlockType';
	import * as cryptoJ from 'crypto-js';

	@Component
	export default class EventsChild extends Vue {
	@Prop() private cardData!: BlockType;
	@Prop()  private blockIndex!:  number;
	private cardDataChanged = false;
	private status = false;


	@Emit('update-class-info')
	updateClass() {
	this.cardDataChanged = false
	return this.cardData
	}

	@Emit('hash-message')
	hashMessage(){
	console.log('hash not found')
	return 'Hello from child - ' + this.cardData.name;
	}


	@Watch('cardData', {immediate: false, deep: true})
	onCardDataChanged(){
	this.cardDataChanged = true;
	this.cardData.hash = cryptoJ.SHA256(this.cardData.id + this.cardData.priorHash + this.cardData.timestamp + this.cardData.data + this.cardData.difficultyLevel + this.cardData.nonce).toString();
	this.notifyParentDetail();


	}



	}







</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

