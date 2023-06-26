<script>
    export let form
    import CenterLogoNavbar from '$lib/components/CenterLogoNavbar.svelte'
</script>

<!-- <CenterLogoNavbar/> -->

<div class="h-screen flex items-center justify-center relative bg-image" style="background-image: url('library (1).jpg');background-size: cover;background-position: center;">
    <div class="w-96 p-6 shadow-lg bg-base-200 rounded-lg max-w-[90%] min-w-[24rem] z-10">
        <h1 class="text-xl font-bold block text-center text-white">Log In</h1>
        <form action="?/login" method="POST">
            <div class="form-control w-full mb-3 mt-8 relative">
                <i class="fa-solid fa-envelope absolute pointer-events-none top-1/2 -translate-y-1/2 left-5"></i>
                <input type="email" placeholder="Email" name="email" class="input w-full pl-12" />
            </div>
            <div class="form-control w-full mb-3 mt-3 relative">
                <i class="fa-solid fa-lock absolute pointer-events-none top-1/2 -translate-y-1/2 left-5"></i>
                <input type="password" placeholder="Password" name="password" class="input w-full pl-12" />
            </div>
            <button type="submit" class="btn btn-accent mb-3 mt-3 w-full">LOG IN</button>
        </form>
        {#if form?.failed}
        <h2 class="text-center text-red-600 text-xs">{form?.message}</h2>
        {/if}
        <h2 class="text-center text-base-content text-xs">Don't have an account yet? <a href="/register" class="text-info">Sign Up</a></h2>
    </div>
</div>

<style>
    .bg-image::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
    }
</style>