<script lang="ts">
	export let data;

	const { user } = data;
</script>

{#if user}
	<p>Hello {user.username}</p>
{:else}
	<div class="space-y-4 text-center">
		<h2 class="text-8xl">Literally the best chat app</h2>
		<p class="text-2xl">Sign in to start chatting</p>
	</div>
{/if}
