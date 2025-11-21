<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar'
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import type { Component } from 'svelte';

	export interface Menu {
		title: string
		url: Pathname
		icon: Component
	}
	export interface SidebarProps {
		menus: Menu[]
	}

	const { menus }: SidebarProps = $props()
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each menus as menu (menu.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({props})}
									<a href={resolve(menu.url)} {...props}>
										<menu.icon />
										<span>{menu.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>