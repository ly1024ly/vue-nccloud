<template>
	<div class="all">
		<div class="card-content">
			
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "../style/allmachine.scss"
</style>

<script type="text/javascript">
import * as api from '../api/server.js';
import card from './card.vue';
export default {
	data(){
		return {
			allMachine:[]
		}
	},
	components:{
		card
	},
	mounted(){
		this.$emit("success","success");
		api.getAllMachine()
			.then(function(res){
				console.log(res)
				if(res.data.result=="success"){
					this.allMachine = res.data.values;
				}
			})
	}
}
</script>