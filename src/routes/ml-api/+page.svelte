<script>
    export let form

    // function handleSubmit(event) {
    //     // event.preventDefault();
    // }
    // let message
    // let prediction
    // let formData = new FormData()

    // async function predict(event) {
    //     event.preventDefault()
    //     console.log('predicting...')

    //     const res = await fetch("http://localhost:5000/", {
    //         method: "POST",
    //         body: formData.append("message", message)
    //     })
    //     prediction = await res.json()
    // }
</script>

<div class="h-full flex items-center justify-center">
    <div class="w-96 p-6 shadow-lg bg-neutral rounded-[40px] max-w-[90%]">
        <h1 class="text-2xl font-extrabold block text-center text-neutral-content">Abusive Language Classifier</h1>
        <form action="?/predict" method="POST">
            <div class="w-full mb-3 mt-8 relative">
                <textarea class="textarea w-full h-36" placeholder="Your message (in Bahasa)" name="message"></textarea>
            </div>
            <button class="btn btn-primary mt-3 mb-3 w-full">Check Toxicity</button>
        </form>
        <p class="text-neutral-content mt-3 mx-3">Message: {form?.message}</p>
        <p class="text-neutral-content mt-3 mx-3">Status: {form?.prediction.status} with {form?.prediction.score} toxicity.</p>
    </div>
</div>