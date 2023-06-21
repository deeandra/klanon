/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */

import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    
    let success = false
    let message = ""
    let class_id = ""
    let class_name = ""
    let avatar_url = ""
    const body = await request.json()

    try {
        const { data, error:err } = await locals.supabase.from('class')
        .select()
        .eq('invitation_code', body.invitation_code)
        .single()

        if (err) {
            message = "Incorrect invitation code or password"
        }
        else if (data) {
            class_id = data.id
            class_name = data.name
            avatar_url = data.avatar_url
    
            if (data.invitation_password == body.invitation_password) {
                success = true
            } else {
                message = "Incorrect invitation password"
            }
        }
    } 
    catch (error) {

    }

    const res = {
        success: success,
        class_id: class_id,
        class_name: class_name,
        avatar_url: avatar_url,
        message: message
    }

    return json(res) 
}