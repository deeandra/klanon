import { redirect } from '@sveltejs/kit';
import { PUBLIC_MODEL_API_URL } from '$env/static/public'

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
    }).order('updated_at', { ascending: false })
    
    if (err1) {
        console.log(err1)
    }
    else if(posts){ 
        for (let i=0; i<posts?.length; i++) {
            if(posts[i].op_id != session.user.id) {
                posts[i].op_id = ""
            }
            
            if (posts[i].op_anon_status != 'none') {
                if(posts[i].op_anon_status == 'partial') {
                    const {data: user_role, error:err_role} = await locals.supabase
                        .from('user_class')
                        .select('role')
                        .eq('user_id', session.user.id)
                        .eq('class_id', posts[i].class_id)
                    if (err_role) {
                        console.log(err_role)
                    }

                    if (user_role[0].role == "instructor" || posts[i].op_id == session.user.id) {
                        posts[i].author_name = posts[i].op_display_name
                        console.log(posts[i].author_name)
                    }
                }
                posts[i].op_display_name = posts[i].op_pseudonym
                posts[i].op_avatar_url = ""
            }
        }
    }

    const { data:thisClass, error:err2 } = await locals.supabase
      .from('class')
      .select('id, name, description, avatar_url, invitation_code, invitation_password, user_class(role, display_name)')
      .eq('id', class_id)
      .eq('user_class.user_id', session.user.id)
      .single()
    
    if (err2) {
        console.log(err2)
    }

    const { data:members, error:err3 } = await locals.supabase
        .from('user_class')
        .select('user_id, role, display_name, users(avatar_url)')
        .eq('class_id', class_id)
    
    if (err3) {
        console.log(err3)
    }

    return { thisClass, posts, members };
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

        // || body.role != "student"
        if (body.post_status == "draft" || body.post_status == "pending") {
            // console.log(body)
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
                // console.log(body)
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

    editclass: async ({request, locals}) => {
        const session = await locals.getSession();

        const body = Object.fromEntries(await request.formData())

        const { error:err1 } = await locals.supabase.from('class')
            .update({
                name: body.name,
                invitation_code: body.invitation_code,
                invitation_password: body.invitation_password,
                description: body.description,
                avatar_url: body.avatar_url
            })
            .eq('id', body.class_id)


        if (err1) {
            console.log(err1)
        }


        return
        
    },

    changedisplayname: async ({request, locals, params}) => {
        const session = await locals.getSession();
        const class_id = params.class_id

        const body = Object.fromEntries(await request.formData())

        const { error:err } = await locals.supabase.from('user_class')
            .update({display_name: body.display_name})
            .eq('user_id', session.user.id)
            .eq('class_id', class_id)

        if (err) {
            console.log(err)
        }
        
    },

    changerole: async ({request, locals, params}) => {
        const session = await locals.getSession();
        const class_id = params.class_id

        const body = Object.fromEntries(await request.formData())

        const { error:err } = await locals.supabase.from('user_class')
            .update({role: body.new_role})
            .eq('user_id', body.member_id)
            .eq('class_id', class_id)

        if (err) {
            console.log(err)
        }
        
    },
};