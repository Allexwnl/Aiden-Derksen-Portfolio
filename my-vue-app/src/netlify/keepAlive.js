import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://reverggwhilxgijmxidc.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function handler(event, context) {
  try {
    // 1️⃣ Voeg dummy project toe
    const { data: addedProject, error: insertError } = await supabase
      .from('projects')
      .insert([{
        title: 'keep-alive project',
        description: 'Automatisch toegevoegd om de database actief te houden',
        images: []
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Fout bij toevoegen project:', insertError.message)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: insertError.message })
      }
    }

    console.log('Dummy project toegevoegd met ID:', addedProject.id)

    // 2️⃣ Verwijder het project direct
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', addedProject.id)

    if (deleteError) {
      console.error('Fout bij verwijderen project:', deleteError.message)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: deleteError.message })
      }
    }

    console.log('Dummy project verwijderd. Database ping succesvol!')

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Database ping succesvol!' })
    }

  } catch (err) {
    console.error('Onverwachte fout:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message })
    }
  }
}
