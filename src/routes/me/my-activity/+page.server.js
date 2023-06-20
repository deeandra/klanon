import { redirect } from '@sveltejs/kit';

/* eslint-disable no-unused-vars */
export const load = async ({ locals, params }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, "/")
    }

    let { data:posts, error:err1 } = await locals.supabase.rpc('get_my_posts', {
        session_user_id: session.user.id
    }). order('created_at', { ascending: false })
    
    if (err1) {
        console.log(err1)
    }
    
    console.log(posts)

    return { posts };
};

export const actions = {
    postedit: async ({request, locals, cookies, params}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        let message = ""
        let prediction = {}

        const formData = new FormData();
        formData.append('message', body.title + ". " + body.content)

        console.log(formData)
        // || body.role != "student"

        if (body.post_status == "draft" || body.post_status == "pending") {
            const { data:post, error:err1 } = await locals.supabase.from('post')
                .update({
                    post_status: body.post_status,
                    title: body.title,
                    content: encodeURIComponent(body.content)
                })
                .eq('id', body.post_id)

            console.log(post)

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
                    .update({
                        anon_status: body.anon_status,
                        pseudonym: pseudonym
                    })
                    .eq('user_id', session.user.id)
                    .eq('post_id', body.post_id)

                if (err2) {
                    console.log(err1)
                }else {
                    message = "success"
                }
            }
        }
        else{
            try {
                const res = await fetch("http://127.0.0.1:5000/predict", {
                    method: "POST",
                    body: formData
                })
                prediction = await res.json()
                console.log(prediction)
            }
            catch (error) {
                console.error(error)
            }

            if (parseFloat(prediction.score) < 70) {
                const { data:post, error:err1 } = await locals.supabase.from('post')
                    .update({
                        post_status: body.post_status,
                        title: body.title,
                        content: encodeURIComponent(body.content)
                    })
                    .eq('id', body.post_id)

                console.log(post)

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
                        .update({
                            anon_status: body.anon_status,
                            pseudonym: pseudonym
                        })
                        .eq('user_id', session.user.id)
                        .eq('post_id', body.post_id)

                    if (err2) {
                        console.log(err1)
                    }else {
                        message = "success"
                    }
                }
            }else {
                message = "abusive language detected"
            }
        }


        return { prediction, message, body }
    },


    delete: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        const { error:err1 } = await locals.supabase.from('post')
            .update({is_deleted: true})
            .eq('id', body.post_id)
            .select().single()


        if (err1) {
            console.log(err1)
        }

        return
        
    },
};