// ==========================================
// AUTH MODULE (Supabase)
// ==========================================
const Auth = {
  async signup(email, password, username) {
    if (!window.sb?.auth) {
      return { data: null, error: { message: "Supabase client nije inicijalizovan (window.sb)." } };
    }

    const { data, error } = await window.sb.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    return { data, error };
  },

  async login(email, password) {
    if (!window.sb?.auth) {
      return { data: null, error: { message: "Supabase client nije inicijalizovan (window.sb)." } };
    }

    const { data, error } = await window.sb.auth.signInWithPassword({
      email,
      password
    });

    return { data, error };
  },

  async logout() {
    if (!window.sb?.auth) return { error: { message: "Supabase client nije inicijalizovan (window.sb)." } };
    const { error } = await window.sb.auth.signOut();
    return { error };
  },

  async requestPasswordReset(email) {
    if (!window.sb?.auth) {
      return { data: null, error: { message: "Supabase client nije inicijalizovan (window.sb)." } };
    }

    // IMPORTANT: URL mora biti u Supabase Auth Redirect URLs ako koristiš production domen.
    const { data, error } = await window.sb.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });

    return { data, error };
  },

  async updatePassword(newPassword) {
    if (!window.sb?.auth) {
      return { data: null, error: { message: "Supabase client nije inicijalizovan (window.sb)." } };
    }

    const { data, error } = await window.sb.auth.updateUser({
      password: newPassword
    });

    return { data, error };
  },

  async getSession() {
    if (!window.sb?.auth) return { data: null, error: { message: "Supabase client nije inicijalizovan (window.sb)." } };
    return await window.sb.auth.getSession();
  }
};

window.Auth = Auth;
console.log("AUTH LOADED ✅", Auth);
