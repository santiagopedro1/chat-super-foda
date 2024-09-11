<script>
	import { ModeWatcher, toggleMode, mode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';

	import { Sun, Moon, LogOut } from 'lucide-svelte';

	import '../app.css';

	export let data;
</script>

<ModeWatcher />
<header class="container grid grid-cols-3 items-center py-4">
	<div>Logo aqui</div>
	<Button
		class="justify-self-center text-xl font-bold"
		variant="link"
		href="/"
	>
		Chat SUper FOda
	</Button>
	<div class="flex items-center gap-4 justify-self-end">
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
			<Button
				href="/signout"
				size="icon"
			>
				<LogOut />
			</Button>
		{:else}
			<Button href="/signin">Sign In</Button>
		{/if}
	</div>
</header>
<div class="py-4">
	<slot></slot>
</div>
