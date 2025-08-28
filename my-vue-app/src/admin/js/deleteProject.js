async function deleteProject(projectId) {
  // 1. Verwijder afbeeldingen
  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)

  for (const img of images) {
    const path = img.image_url.split('/project-images/')[1]
    await supabase.storage.from('project-images').remove([path])
  }

  await supabase.from('project_images').delete().eq('project_id', projectId)

  // 2. Verwijder project
  await supabase.from('projects').delete().eq('id', projectId)

  alert('Project verwijderd!')
}
