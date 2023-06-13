<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</svelte:head>

<script>
    export let form
    import CenterLogoNavbar from '$lib/components/CenterLogoNavbar.svelte'
</script>

<CenterLogoNavbar/>

<div class="h-full flex items-center justify-center">
    <div class="w-96 p-6 shadow-lg bg-base-100 rounded-lg max-w-[90%] min-w-[24rem]">
        <h1 class="text-2xl font-bold block text-center text-base-content">Register</h1>
        <form action="?/signup" method="POST">
            <div class="w-full mb-3 mt-8 relative">
                <i class="fa-solid fa-envelope absolute pointer-events-none top-1/2 -translate-y-1/2 left-5"></i>
                <input type="email" placeholder="Email" name="email" class="input w-full pl-12" />
            </div>
            <div class="w-full mb-3 mt-3 relative">
                <i class="fa-solid fa-user absolute pointer-events-none top-1/2 -translate-y-1/2 left-5"></i>
                <input type="text" placeholder="Full Name" name="full_name" class="input w-full pl-12" />
            </div>
            <div class="w-full mb-3 mt-3 relative">
                <i class="fa-solid fa-at absolute pointer-events-none top-1/2 -translate-y-1/2 left-5"></i>
                <input type="text" placeholder="Username" name="username" class="input w-full pl-12" />
            </div>
            <div class="w-full mb-3 mt-3 relative">
                <i class="fa-solid fa-lock absolute pointer-events-none top-1/2 -translate-y-1/2 left-5"></i>
                <input type="password" placeholder="Password" name="password" class="input w-full pl-12" />
            </div>
            <button class="btn btn-neutral mb-3 mt-3 w-full">SIGN UP</button>
        </form>
        {#if form?.failed}
        <h2 class="text-center text-red-600 text-xs">{form?.message}</h2>
        {/if}
        <h2 class="text-center text-base-content text-xs">Already have an account? <a href="/login" class="text-info">Log in</a></h2>
    </div>
</div>