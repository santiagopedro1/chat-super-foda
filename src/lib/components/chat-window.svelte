<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';

	import { PUBLIC_WS_PORT } from '$env/static/public';

	import { Send } from 'lucide-svelte';

	interface Props {
		user: { id: string; username: string };
	}

	const { user }: Props = $props();

	const ws = new WebSocket('ws://localhost:' + PUBLIC_WS_PORT);

	let messages: Array<{ userId: string; content: string }> = $state([]);
	let allUsers: Array<{ id: string; username: string }> = $state([]);

	ws.onopen = () => {
		console.log('Connected to the server!');
		ws.send(JSON.stringify({ type: 'config' }));
	};

	ws.onmessage = (event) => {
		const response = JSON.parse(event.data);
		switch (response.type) {
			case 'config':
				messages = response.messages;
				allUsers = response.allUsers;
				break;

			case 'status':
				console.log(response.content);
				break;
		}
	};

	let newMessage = $state('');

	function sendMessage() {
		messages.push({ userId: user.id, content: newMessage });
		ws.send(
			JSON.stringify({ type: 'new message', data: { userId: user.id, content: newMessage } })
		);
		newMessage = '';
	}
</script>

<div class="flex h-[83vh] flex-col overflow-hidden">
	<ScrollArea class="flex-grow p-4">
		{#each messages as message}
			<div class="mb-4 text-lg {message.userId === user.id ? 'text-right' : 'text-left'}">
				<p class="mb-1 font-semibold">
					{allUsers.find((u) => u.id === message.userId)?.username}
				</p>
				<div
					class="inline-block max-w-[65%] {message.userId === user.id
						? 'bg-primary text-primary-foreground'
						: 'bg-secondary text-secondary-foreground'} rounded-lg p-2"
				>
					<p>{message.content}</p>
				</div>
			</div>
		{/each}
	</ScrollArea>

	<Separator />

	<form
		onsubmit={sendMessage}
		class="flex items-center gap-2 p-4"
	>
		<Input
			type="text"
			placeholder="Type your message..."
			bind:value={newMessage}
			class="flex-grow"
		/>
		<Button
			type="submit"
			variant="default"
		>
			<Send class="mr-2 h-4 w-4" />
			Send
		</Button>
	</form>
</div>
