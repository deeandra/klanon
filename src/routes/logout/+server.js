import { error, redirect } from '@sveltejs/kit'

export async function POST({ locals }) {

    try {
        const {error: err} = await locals.supabase.auth.signOut()

        if (err) {
            throw error(500, 'Something went wrong logging you out.')
        }
    
    }
    catch(error) {
        console.log(error)
    }

  
    throw redirect(303, '/')
}