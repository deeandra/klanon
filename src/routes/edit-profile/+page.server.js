export const actions = {
    editprofile: async ({request, locals}) => {
        const session = await locals.getSession();
    
        const body = Object.fromEntries(await request.formData())
    
        const { error:err } = await locals.supabase.from('users')
            .update({
                full_name: body.full_name,
                username: body.username,
                avatar_url: body.avatar_url
            })
            .eq('id', session.user.id)
    
    
        if (err) {
            console.log(err)
        }
    
    
        return
        
    },
}
