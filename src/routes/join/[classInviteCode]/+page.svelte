<script>
    export let data
</script>

<div class="h-full flex items-center justify-center">
    <div class="w-96 p-6 shadow-lg bg-neutral rounded-[40px] max-w-[90%]">
        <!-- <h1 class="text-2xl font-extrabold block text-center text-neutral-content">Join Class</h1> -->
        <h3 class="my-6 text-2xl font-bold block text-center text-neutral-content">{data?.class_name}</h3>
        <p class="block text-center text-neutral-content">Do you want to join this class?</p>
        <form action="?/join" method="POST">
            <button type="submit" class="btn btn-primary mt-3 mb-3 w-full">Join</button>
            <!-- <button type="submit" class="btn btn-secondary mb-3 w-full">Create As Student</button> -->
        </form>
    </div>
</div>