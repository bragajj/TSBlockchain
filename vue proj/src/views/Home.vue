<template>
	<div>
		<b-jumbotron bg-variant="info" text-variant="white" border-variant="light">
			<template #header="">TSBlockchain</template>
			<template #lead="">
				Blockchain proof of concept utilizing Typescript and Vue.
			</template>
			<hr class="my-4">
				<p>
					Designed by Laura M., Matthew P., and Jeff B.
				</p>
				<b-button variant="primary" href="./tsblockchain">Get Started</b-button>
			</b-jumbotron>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {}
</script>
