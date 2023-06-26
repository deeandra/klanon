import { redirect } from '@sveltejs/kit';
import { PUBLIC_MODEL_API_URL } from '$env/static/public'

/* eslint-disable no-unused-vars */
export const load = async ({ locals, params }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, "/")
    }

    let { data:posts, error:err1 } = await locals.supabase.rpc('get_my_posts', {
        session_user_id: session.user.id
    }).order('updated_at', { ascending: false })
    
    if (err1) {
        console.log(err1)
    }
    else if(posts){ 
        for (let i=0; i<posts?.length; i++) {
            if (posts[i].op_anon_status != 'none') {
                posts[i].op_display_name = posts[i].op_pseudonym
                posts[i].op_avatar_url = ""
            }
        }
    }

    let { data:comments, error:err2 } = await locals.supabase.rpc('get_my_comments', {
        session_user_id: session.user.id
    }).order('updated_at', { ascending: false })
    
    if (err2) {
        console.log("get_my_comments")
        console.log(err2)
    }
    else if(comments){ 
        for (let i=0; i<comments?.length; i++) {
            if (comments[i].op_anon_status != 'none') {
                comments[i].op_display_name = comments[i].op_pseudonym
                comments[i].op_avatar_url = ""
            }
            if (comments[i].post_op_anon_status != 'none') {
                comments[i].post_op_display_name = comments[i].post_op_pseudonym
                comments[i].post_op_avatar_url = ""
            }
            if (comments[i].parent_op_anon_status != 'none') {
                comments[i].parent_op_display_name = comments[i].parent_op_pseudonym
                comments[i].parent_op_avatar_url = ""
            }
        }
    }


    let { data:comment_anon_statuses, error:err3 } = await locals.supabase.rpc('get_anon_status_for_my_comments', {
        session_user_id: session.user.id
    })
    if (err3) {
        console.log(err3)
    }
    
    // console.log(comments)

    return { posts, comments, comment_anon_statuses };
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
                const res = await fetch(PUBLIC_MODEL_API_URL, {
                    method: "POST",
                    body: formData
                })
                prediction = await res.json()
                console.log(prediction)
            }
            catch (error) {
                console.error(error)
            }

            if (parseFloat(prediction.score) <= 50) {
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

    commentedit: async ({request, locals, cookies, params}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        let message = ""
        let prediction = {}

        const formData = new FormData();
        formData.append('message', body.content)

        console.log(formData)

        const { data:user_post_anon_status1, error:err3 } = await locals.supabase.rpc('get_anon_status_for_comment', {
            current_post_id: body.post_id,
            session_user_id: session.user.id
        })

        const user_post_anon_status = user_post_anon_status1[0] ? user_post_anon_status1[0] : ""
        
        let insertData = {
            comment_status: body.comment_status,
            content: encodeURIComponent(body.content)
        }
        if(body.parent_id) {
            insertData.parent_id = body.parent_id
        }
        // || body.role != "student"

        if (body.post_status == "draft" || body.post_status == "pending") {
            const { data:comment, error:err1 } = await locals.supabase.from('comment')
                .update(insertData)
                .eq('id', body.comment_id)
                .select()

            if (err1) {
                console.log(err1)
            }
            else if (!user_post_anon_status) {
                let pseudonym
                if (body.anon_status == "none") {
                    pseudonym = ""
                }
                else {
                    pseudonym = body.pseudonym
                }

                const { data:anon_status, error:err2 } = await locals.supabase.from('user_post_anon_status')
                    .upsert({
                        user_id: session.user.id, 
                        post_id: body.post_id,
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
                const res = await fetch(PUBLIC_MODEL_API_URL, {
                    method: "POST",
                    body: formData
                })
                prediction = await res.json()
                console.log(prediction)
            }
            catch (error) {
                console.error(error)
            }

            if (parseFloat(prediction.score) <= 50) {
                const { data:comment, error:err1 } = await locals.supabase.from('comment')
                    .update(insertData)
                    .eq('id', body.comment_id)
                    .select()

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
                        .upsert({
                            user_id: session.user.id, 
                            post_id: body.post_id,
                            anon_status: body.anon_status,
                            pseudonym: pseudonym
                        }).select()

                    if (err2) {
                        console.log(err1)
                    }else {
                        message = "success"
                    }
                }
            } else {
                message = "abusive language detected"
            }
        }

        return { 
            comment_prediction:prediction, 
            comment_message: message, 
            comment_body: body 
        }
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

        const { error:err2 } = await locals.supabase.from('comment')
            .update({is_deleted: true})
            .eq('post_id', body.post_id)


        if (err2) {
            console.log(err2)
        }


        return
        
    },

    likecomment: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        let { error:err } = await locals.supabase.rpc('add_or_delete_comment_like', {
            session_user_id: session.user.id,
            current_comment_id: body.comment_id
        })
        
        if (err) {
            console.log(err)
        }
        
    },

    likepost: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        let { error:err } = await locals.supabase.rpc('add_or_delete_post_like', {
            session_user_id: session.user.id,
            current_post_id: body.post_id
        })
        
        if (err) {
            console.log(err)
        }
        
    },

    save: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        let { error:err } = await locals.supabase.rpc('add_or_delete_user_saved', {
            session_user_id: session.user.id,
            current_post_id: body.post_id
        })
        
        if (err) {
            console.log(err)
        }
        
    },
};