<script>
    export let data
</script>

<div class="h-screen bg-base-100 flex items-center justify-center lg:justify-start w-full relative bg-image" style="background-image: url('library (1).jpg');background-size: cover;background-position: center;">
    <div class="hero-content text-base-content justify-left w-full lg:w-1/2">
        <!-- <img src="/education.jpg" alt="" class="rounded-full max-w-[30%] pb-3"> -->
        <div class="max-w-md text-left z-10">
            <h1 class="mb-5 text-7xl md:text-6xl font-bold font-serif text-white">Welcome to Klanon!</h1>
            <p class="mt-6 text-2xl text-gray-300">Klanon is an online class discussion board where you can participate anonymously.</p>
            {#if !data.session}
                <a href="/register">
                    <button class="btn btn-accent mt-8">Create an Account</button>
                </a>
            {:else}
                <a href="/me">
                    <button class="btn btn-accent mt-8">Open Klanon</button>
                </a>
            {/if}
        </div>
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


