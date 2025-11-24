<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import type { LayoutProps } from './$types';
  import { CalendarIcon, HouseIcon, InboxIcon, SearchIcon, SettingsIcon } from '@lucide/svelte';

  import AppSidebar from '$lib/components/sidebar/sidebar.svelte';

  let { children }: LayoutProps = $props();

  type MenuUrl = '/' | '/tracingLight' | '/draggable' | '/draggable/' | '/file' | '/file/' | '/tracingLight/';
  const menus: { title: string; url: MenuUrl; icon: any }[] = [
    {
      title: 'Home',
      url: '/',
      icon: HouseIcon
    },
    {
      title: '追踪光线',
      url: '/tracingLight',
      icon: InboxIcon
    },
    {
      title: '拖拽',
      url: '/draggable',
      icon: CalendarIcon
    }
  ];
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Sidebar.Provider>
  <AppSidebar {menus} />
  <main class="flex-1">
    {@render children()}
  </main>
</Sidebar.Provider>
