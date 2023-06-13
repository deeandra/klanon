/** @type {import('./$types').Actions} */
export const actions = {
    predict: async ({request}) => {

        const body = await request.formData()

        const message = body.get("message")
        let prediction = {}

        try {
            const res = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                body: body
            })
            prediction = await res.json()
            console.log(prediction)
        }
        catch (error) {
            console.error(error)
        }
        

        return { prediction,  message }
    }
};