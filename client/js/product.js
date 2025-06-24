(async function checkAuth(){
  try{
    const res = await fetch('/check-auth', {
      method: 'GET',
      credentials: 'include'
    })

    if(!res.ok){
      window.location.href = '/login';
      return;
    }

    const data = await res.json();
    console.log("User is logged in: ", data.user);
  }catch(error){
    console.log("Auth checked failed", error);
    window.location.href = '/login';
  }
})();