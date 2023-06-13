<script>
    import "../app.css";
    import { invalidateAll } from '$app/navigation'
    import { onMount } from 'svelte'

    export let data

    $: ({ supabase } = data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidateAll()
		})

		return () => data.subscription.unsubscribe()
	})
</script>
  

<div class="absolute inset-0 bg-base-100" data-theme="light">
    <slot />
</div>