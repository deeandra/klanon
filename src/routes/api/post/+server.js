/* eslint-disable no-unused-vars */
import { redirect, json } from '@sveltejs/kit'

export async function POST({ request, locals }) {
    const session = await locals.getSession();
    const body = Object.fromEntries(await request.formData())

    let prediction = {}
    // const message = body.content

    // try {
    //     const res = await fetch("http://127.0.0.1:5000/predict", {
    //         method: "POST",
    //         body: body
    //     })
    //     prediction = await res.json()
    //     console.log(prediction)
    // }
    // catch (error) {
    //     console.error(error)
    // }

    const { data:post, error:err1 } = await locals.supabase.from('post')
        .insert({
            user_id: session.user.id, 
            class_id: body.class_id,
            post_status: body.post_status,
            title: body.title,
            content: encodeURIComponent(body.content)
        }).select().single()

    if (err1) {
        console.log(err1)
    }
    else {
        let pseudonym
        if (body.anon_status == "none") {
            pseudonym = ""
        }
        else {
            pseudonym = body.pseudonym
        }

        const { data:anon_status, error:err2 } = await locals.supabase.from('user_post_anon_status')
            .insert({
                user_id: session.user.id, 
                post_id: post.id,
                anon_status: body.anon_status,
                pseudonym: pseudonym
            }).select()

        if (err2) {
            console.log(err1)
        }
    }
    
    const res = {success: true}
    
    return json(res)
}