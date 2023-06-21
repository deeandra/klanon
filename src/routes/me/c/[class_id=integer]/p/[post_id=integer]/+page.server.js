import { redirect } from '@sveltejs/kit';

/* eslint-disable no-unused-vars */
export const load = async ({ locals, params, cookies }) => {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, "/")
    }
 
    const class_id = params.class_id
    const post_id = params.post_id
    console.log(post_id)

    let { data:post1, error:err1 } = await locals.supabase.rpc('get_post', {
        current_post_id: post_id,
        session_user_id: session.user.id
    })
    
    if (err1) {
        console.log(err1)
    }

    const post = post1[0]
    if(post1?.length > 0){ 
        if(post.op_id != session.user.id) {
            post.op_id = ""
        }
        
        if (post.op_anon_status != 'none') {
            post.op_display_name = post.op_pseudonym
            post.op_avatar_url = ""
        }
    }
    console.log(post)

    const { data:thisClass1, error:err2 } = await locals.supabase
      .from('class')
      .select('name, user_class(role, display_name)')
      .eq('id', class_id)
      .eq('user_class.user_id', session.user.id)
    
    if (err2) {
        console.log(err2)
    }

    const thisClass = thisClass1[0]

    const { data:user_post_anon_status1, error:err3 } = await locals.supabase.rpc('get_anon_status_for_comment', {
        current_post_id: post_id,
        session_user_id: session.user.id
    })
    
    if (err3) {
        console.log(err3)
    }

    const user_post_anon_status = user_post_anon_status1[0] ? user_post_anon_status1[0] : ""

    let { data:comments, error:err4 } = await locals.supabase.rpc('get_comments', {
        current_post_id: post_id,
        session_user_id: session.user.id
    }).order('updated_at', { ascending: true })
    
    if (err4) {
        console.log(err4)
    }
    else if(comments.length > 0){ 
        for (let i=0; i<comments.length; i++) {
            if(comments[i].op_id != session.user.id) {
                comments[i].op_id = ""
            }
            
            if (comments[i].op_anon_status != 'none') {
                comments[i].op_display_name = comments[i].op_pseudonym
                comments[i].op_avatar_url = ""
            }
        }
    }

    console.log(comments)

    console.log(user_post_anon_status)

    return { thisClass, post, user_post_anon_status, comments };
};


export const actions = {
    comment: async ({request, locals, cookies, params}) => {
        const session = await locals.getSession();

        const class_id = params.class_id
        const post_id = params.post_id

        const body = Object.fromEntries(await request.formData())

        let message = ""
        let prediction = {}

        const formData = new FormData();
        formData.append('message', body.content)

        console.log(formData)

        const { data:user_post_anon_status1, error:err3 } = await locals.supabase.rpc('get_anon_status_for_comment', {
            current_post_id: post_id,
            session_user_id: session.user.id
        })
        
        if (err3) {
            console.log(err3)
        }

        const user_post_anon_status = user_post_anon_status1[0] ? user_post_anon_status1[0] : ""
        
        let insertData = {
            user_id: session.user.id, 
            post_id: post_id,
            comment_status: body.comment_status,
            content: encodeURIComponent(body.content)
        }
        if(body.parent_id) {
            insertData.parent_id = body.parent_id
        }
        
        
        // || body.role != "student"
        if (body.comment_status == "draft" || body.comment_status == "pending") {

            const { data:comment, error:err1 } = await locals.supabase.from('comment')
                .insert(insertData).select()

            console.log(comment)

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
                        post_id: post_id,
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

            if (parseFloat(prediction.score) <= 50) {
                const { data:comment, error:err1 } = await locals.supabase.from('comment')
                .insert(insertData).select()

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
                            post_id: post_id,
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

        return { prediction, message, body }
    },


    delete: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        const { error:err1 } = await locals.supabase.from('post')
            .update({is_deleted: true})
            .eq('id', body.post_id)


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

    pin: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        const { error:err1 } = await locals.supabase.from('post')
            .update({is_pinned: true})
            .eq('id', body.post_id)


        if (err1) {
            console.log(err1)
        }
        
    },

    unpin: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        const { error:err1 } = await locals.supabase.from('post')
            .update({is_pinned: false})
            .eq('id', body.post_id)

        if (err1) {
            console.log(err1)
        }
        
    },

    deletecomment: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        const { error:err1 } = await locals.supabase.from('comment')
            .update({is_deleted: true})
            .eq('id', body.comment_id)


        if (err1) {
            console.log(err1)
        }

        const { error:err2 } = await locals.supabase.from('comment')
            .update({is_deleted: true})
            .eq('parent_id', body.comment_id)


        if (err2) {
            console.log(err2)
        }


        return
        
    },

    pincomment: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        const { error:err1 } = await locals.supabase.from('comment')
            .update({is_pinned: true})
            .eq('id', body.comment_id)



        if (err1) {
            console.log(err1)
        }
        
    },

    unpincomment: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        const { error:err1 } = await locals.supabase.from('comment')
            .update({is_pinned: false})
            .eq('id', body.comment_id)


        if (err1) {
            console.log(err1)
        }
        
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