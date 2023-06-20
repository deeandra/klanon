<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</svelte:head>

<script>
    import "../app.css";
    import { invalidateAll } from '$app/navigation'
    import { onMount } from 'svelte'
	import Navbar from "$lib/components/Navbar.svelte";
    import { minidenticonSvg } from 'minidenticons'


    export let data

    $: ({ supabase } = data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidateAll()
		})

		return () => data.subscription.unsubscribe()
	})
</script>

<div class="absolute inset-0 bg-base-100 overflow-hidden min-h-screen max-h-fit" data-theme="dark">
    <Navbar {data}/>
    <slot />
</div>


