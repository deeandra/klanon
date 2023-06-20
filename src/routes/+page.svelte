<script>
    export let data
</script>

<div class="h-screen bg-base-100 flex items-center justify-center">
    <div class="hero-content text-center text-base-content flex-col justify-center pt-16">
        <img src="/education.jpg" alt="" class="rounded-full max-w-[30%] pb-3">
        <div class="max-w-md px-10">
            <h1 class="mb-5 text-4xl md:text-5xl font-bold font-serif">Welcome to Klanon!</h1>
            <p class="mb-5 text-xl">Online class discussion board where you can participate anonymously.</p>
            {#if !data.session}
                <a href="/register">
                    <button class="btn btn-neutral m-2">Create an Account</button>
                </a>
            {:else}
                <a href="/me">
                    <button class="btn btn-neutral m-2">Open Klanon</button>
                </a>
            {/if}
        </div>
    </div>
</div>



