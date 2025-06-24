document.addEventListener('DOMContentLoaded', function(){
  document.querySelector('form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
        credentials: 'include'
      })
      const data = await response.json();
      if(response.ok){
        alert('Successfully Login');
      }
      else{
        alert("Error: " + (data.message || 'login failed'));
      }
    } catch(err){
      console.log("Error: ", err);
      alert("Something went wrong! Please try again!");
    } 
  });
});