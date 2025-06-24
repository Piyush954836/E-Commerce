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
