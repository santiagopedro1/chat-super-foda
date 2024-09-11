<script>
	import { ModeWatcher, toggleMode, mode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';

	import { Sun, Moon } from 'lucide-svelte';

	import '../app.css';

	export let data;
</script>

<ModeWatcher />
<header class="container mx-auto grid grid-cols-3 items-center py-4">
	<div>Logo aqui</div>
	<Button
		class="justify-self-center text-xl font-bold"
		variant="link"
		href="/"
	>
		Chat SUper FOda
	</Button>
	<div class="flex items-center gap-8 justify-self-end">
		<Button
			onclick={toggleMode}
			size="icon"
			variant="outline"
			class="hover:bg-foreground hover:text-background"
		>
			{#if $mode === 'light'}
				<Moon />
			{:else}
				<Sun />
			{/if}
		</Button>

		{#if data.user}
			<p>{data.user.username}</p>
		{:else}
			<Button href="/signin">Sign In</Button>
		{/if}
	</div>
</header>
<main class="container mx-auto py-8">
	<slot></slot>
</main>
