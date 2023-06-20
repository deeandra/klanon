import { redirect } from '@sveltejs/kit';

/* eslint-disable no-unused-vars */
export const load = async ({ locals, params, cookies }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, "/")
    }
 
    const class_id = params.class_id
    // console.log(class_id)

    let { data:posts, error:err1 } = await locals.supabase.rpc('get_class_posts', {
        current_class_id: class_id,
        session_user_id: session.user.id
    }). order('created_at', { ascending: false })
    
    if (err1) {
        console.log(err1)
    }
    else if(posts){ 
        for (let i=0; i<posts?.length; i++) {
            if(posts[i].op_id != session.user.id) {
                posts[i].op_id = ""
            }
            
            if (posts[i].op_anon_status != 'none') {
                posts[i].op_display_name = posts[i].op_pseudonym
                posts[i].op_avatar_url = ""
            }
        }
    }

    const { data:thisClass, error:err2 } = await locals.supabase
      .from('class')
      .select('name, description, banner_url, user_class(role, display_name)')
      .eq('id', class_id)
      .eq('user_class.user_id', session.user.id)
      .single()
    
    if (err2) {
        console.log(err2)
    }
    console.log(posts)

    // const prediction_message = cookies.get('prediction_message')
    // const title = cookies.get('prediction_message')
    // const content = cookies.get('prediction_message')

    // const lastPostAttempt = {
    //     prediction_message: prediction_message,
    //     title: title,
    //     content: content
    // }

    return { thisClass, posts };
};


export const actions = {
    post: async ({request, locals, cookies, params}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        let message = ""
        let prediction = {}

        const formData = new FormData();
        formData.append('message', body.title + ". " + body.content)

        console.log(formData)

        if (body.post_status == "draft" || body.post_status == "pending" || body.role != "student") {
            const { data:post, error:err1 } = await locals.supabase.from('post')
                .insert({
                    user_id: session.user.id, 
                    class_id: body.class_id,
                    post_status: body.post_status,
                    title: body.title,
                    content: encodeURIComponent(body.content)
                }).select().single()

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
                    .insert({
                        user_id: session.user.id, 
                        post_id: post.id,
                        anon_status: body.anon_status,
                        pseudonym: pseudonym
                    }).select()

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
                    .insert({
                        user_id: session.user.id, 
                        class_id: body.class_id,
                        post_status: body.post_status,
                        title: body.title,
                        content: encodeURIComponent(body.content)
                    }).select().single()

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
                        .insert({
                            user_id: session.user.id, 
                            post_id: post.id,
                            anon_status: body.anon_status,
                            pseudonym: pseudonym
                        }).select()

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

        // cookies.set('prediction_message', message, {path: '/c/' + params.class_id})
        // cookies.set('title', body.title, {path: '/c/' + params.class_id})
        // cookies.set('content', body.content, {path: '/c/' + params.class_id})


        

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

    pin: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        const { data:post, error:err1 } = await locals.supabase.from('post')
            .update({is_pinned: true})
            .eq('id', body.post_id)
            .select().single()

        console.log(post)

        if (err1) {
            console.log(err1)
        }
        
    },

    unpin: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        const { data:post, error:err1 } = await locals.supabase.from('post')
            .update({is_pinned: false})
            .eq('id', body.post_id)
            .select().single()

        console.log(post)

        if (err1) {
            console.log(err1)
        }
        
    }
};