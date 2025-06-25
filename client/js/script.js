window.addEventListener("DOMContentLoaded", async () => {
  const authlink = document.getElementById("login");

  if (!authlink) return;

  try {
    const res = await fetch("/check-auth", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      authlink.textContent = "Logout";
      authlink.href = "#";

      const handleLogout = async (e) => {
        e.preventDefault();

        const logoutRes = await fetch("/api/users/logout", {
          method: "POST",
          credentials: "include",
        });

        if (logoutRes.ok) {
          authlink.textContent = "Login";
          authlink.href = "/login";

          // Remove click listener after logout
          authlink.removeEventListener("click", handleLogout);

          // Reload page (ensure fresh token state)
          window.location.href = '/?t=' + Date.now();
        }
      };

      // ✅ Attach the handler
      authlink.addEventListener("click", handleLogout);

    } else {
      authlink.textContent = "Login";
      authlink.href = "/login";
    }
  } catch (err) {
    console.error("Auth check failed:", err);
    authlink.textContent = "Login";
    authlink.href = "/login";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const sellerLink = document.getElementById('seller');
  if (!sellerLink) return;

  sellerLink.addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('/api/users/become-seller', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message); // Show success message

      // Wait for token to be fully saved before redirect
      setTimeout(() => {
        window.location.href = '/seller';
      }, 500); // short delay just to ensure cookie is set
    } else {
      alert(data.message || 'Failed to become seller');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Server error. Try again.');
  }
});
});
