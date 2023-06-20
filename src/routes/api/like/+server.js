/* eslint-disable no-unused-vars */
import { redirect, json } from '@sveltejs/kit'

export async function POST({ request, locals }) {
    const session = await locals.getSession();
    const body = await request.json()

    if (body.action == "insert") {
        const { data:post, error:err } = await locals.supabase.from('post_like')
            .insert({
                user_id: session.user.id, 
                post_id: body.post_id
            }).select()

        if (err) {
            console.log(err)
        }
    }
    else if (body.action == "delete") {
        const { data:post, error:err } = await locals.supabase.from('post_like')
            .delete()
            .eq('user_id', session.user.id)
            .eq('post_id', body.post_id)

        if (err) {
            console.log(err)
        }
    }

    
    
    const res = {success: true}
    
    return json(res)
}