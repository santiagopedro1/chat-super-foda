<script lang="ts">
	import { ChatWindow } from '$lib/components';

	const { data } = $props();

	const { user } = data;
</script>

<main class="container max-w-5xl">
	{#if user}
		<ChatWindow {user} />
	{:else}
		<div class="space-y-4 text-center">
			<h2 class="text-8xl">Literally the best chat app</h2>
			<p class="text-2xl">Sign in to start chatting</p>
		</div>
	{/if}
</main>
