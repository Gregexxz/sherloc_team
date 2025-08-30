const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.replace('/auth.html');
    }
});