<script>
	import SideNavbar from "$lib/components/SideNavbar.svelte";
    
    export let data;
</script>

<div class="flex bg-base-100 pt-12">
    <SideNavbar {data}/>
    <slot/>
</div>