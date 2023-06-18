/* eslint-disable no-unused-vars */
import { redirect, json } from '@sveltejs/kit'

export async function POST({ request, locals }) {
    const body = await request.json()

    const { data:pin, error:err } = await locals.supabase.from('post')
        .update({is_pinned: true})
        .eq('id', body.post_id)

    if (err) {
        console.log(err)
    }
    
    const res = {success: true}
    
    return json(res)
}