document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),

        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration Successfull");
      } else {
        alert("Error: " + (data.message || "Registration failed"));
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("Something went wrong. Please try again");
    }
  });
});

console.log(4 + 3);
